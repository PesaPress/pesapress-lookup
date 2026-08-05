import qs from "qs";

interface ApiClientOptions {
	baseURL: string;
	timeout?: number;
	defaultHeaders?: Record<string, string>;
}

class ApiError extends Error {
	status?: number;
	data?: unknown;

	constructor(message: string, status?: number, data?: unknown) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data;
	}
}

export class ApiClient {

	private baseURL: string;
	private timeout: number;
	private defaultHeaders: Record<string, string>;

	constructor({ baseURL, timeout = 5000, defaultHeaders = {} }: ApiClientOptions) {
		this.baseURL = baseURL;
		this.timeout = timeout;
		this.defaultHeaders = {
			"Content-Type": "application/json",
			...defaultHeaders,
		};
	}

	/**
	 * Handles API errors and logs them.
	 * @param error - API error
	 */
	private handleError(error: unknown): never {
		if (error instanceof ApiError && error.status) {
			console.error(`API Error (${error.status}):`, error.data);
		} else if (error instanceof Error && error.name === "AbortError") {
			console.error("No response received from API.");
		} else if (error instanceof Error) {
			console.error("Request error:", error.message);
		} else {
			console.error("Request error:", error);
		}
		throw error;
	}

	private buildUrl(endpoint: string, params?: Record<string, any>): string {
		const url = new URL(endpoint, this.baseURL);

		if (params) {
			Object.keys(params).forEach((key) => {
				const value = params[key];
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, String(value));
				}
			});
		}

		return url.toString();
	}

	private async request<T>(endpoint: string, options: RequestInit = {}, params?: Record<string, any>): Promise<T> {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(this.buildUrl(endpoint, params), {
				...options,
				headers: {
					...this.defaultHeaders,
					...options.headers,
				},
				signal: controller.signal,
			});
			const contentType = response.headers.get("content-type") || "";
			const responseData = contentType.includes("application/json") ? await response.json() : await response.text();

			if (!response.ok) {
				throw new ApiError(response.statusText || "API request failed", response.status, responseData);
			}

			return responseData as T;
		} finally {
			clearTimeout(timeout);
		}
	}

	/**
	 * Sends a GET request.
	 * @param endpoint - API endpoint (e.g., "/users")
	 * @param params - Query parameters
	 * @returns Response data
	 */
	async getData<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
		try {
			return await this.request<T>(endpoint, { method: "GET" }, params);
		} catch (error) {
			this.handleError(error);
		}
	}

	/**
	 * Sends a POST request with JSON data.
	 * @param endpoint - API endpoint
	 * @param data - JSON payload
	 * @param headers - Optional extra headers
	 * @returns Response data
	 */
	async postData<T>(endpoint: string, data: Record<string, any>, headers?: Record<string, string>): Promise<T> {
		try {
			return await this.request<T>(endpoint, {
				method: "POST",
				body: JSON.stringify(data),
				headers,
			});
		} catch (error) {
			this.handleError(error);
		}
	}


	/**
	 * Sends a POST request with URL-encoded form data.
	 * @param endpoint - API endpoint
	 * @param data - Form data
	 * @param headers - Optional extra headers
	 * @returns Response data
	 */
	async postForm<T>(endpoint: string, data: Record<string, any>, headers?: Record<string, string>): Promise<T> {
		try {
			return await this.request<T>(endpoint, {
				method: "POST",
				body: qs.stringify(data),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					...headers,
				},
			});
		} catch (error) {
			this.handleError(error);
		}
	}

	/**
	 * Updates default headers dynamically (e.g., setting auth token).
	 * @param newHeaders - Headers to update
	 */
	setHeaders(newHeaders: Record<string, string>) {
		Object.assign(this.defaultHeaders, newHeaders);
	}
}
