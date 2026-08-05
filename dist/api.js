"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiClient = void 0;

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  constructor({
    baseURL,
    timeout = 5000,
    defaultHeaders = {}
  }) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders
    };
  }

  handleError(error) {
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

  buildUrl(endpoint, params) {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  async request(endpoint, options = {}, params) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.buildUrl(endpoint, params), {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers
        },
        signal: controller.signal
      });
      const contentType = response.headers.get("content-type") || "";
      const responseData = contentType.includes("application/json") ? await response.json() : await response.text();

      if (!response.ok) {
        throw new ApiError(response.statusText || "API request failed", response.status, responseData);
      }

      return responseData;
    } finally {
      clearTimeout(timeout);
    }
  }

  async getData(endpoint, params) {
    try {
      return await this.request(endpoint, {
        method: "GET"
      }, params);
    } catch (error) {
      this.handleError(error);
    }
  }

  async postData(endpoint, data, headers) {
    try {
      return await this.request(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async postForm(endpoint, data, headers) {
    try {
      return await this.request(endpoint, {
        method: "POST",
        body: _qs["default"].stringify(data),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...headers
        }
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  setHeaders(newHeaders) {
    Object.assign(this.defaultHeaders, newHeaders);
  }
}

exports.ApiClient = ApiClient;
