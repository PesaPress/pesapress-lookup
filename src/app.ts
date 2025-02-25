import { ApiClient } from "./api";

export class PesaPressLookup {

	private apiClient: ApiClient;

	constructor() {
		this.apiClient = new ApiClient({ baseURL : 'https://api.pesapress.com'});
	}

	/**
	 * Register an email
	 * @param {string} email 
	 * @returns 
	 */
	async register( email : string ){
		try {
			const response = await this.apiClient.postForm<{ data: object }>('/api/numbers/lookup/register', {email : email},
				{"Content-Type": "application/x-www-form-urlencoded"},
			 );
			if ( response ) {
				return response.data;
			}
		} catch (error) {
			console.error("API Error:", error);
			return false;
		}
	}

	/**
	 * Check the status on the account
	 * @param {string} apikey 
	 * @returns 
	 */
	async status( apikey : string) {
		try {
			const response = await this.apiClient.postForm<{ data: object }>('/api/numbers/lookup/status', {}, { apikey: apikey } );
			if ( response ) {
				return response.data;
			}
		} catch (error) {
			console.error("API Error:", error);
			return false;
		}
	}

	/**
	 * Search by api key. Search for the hash
	 * @param {string} apikey The API key
	 * @param {string} hash The msisdn hashs
	 * @returns 
	 */
	async search( apikey : string, hash : string ) {
		try {
			const response = await this.apiClient.postForm<{ data: object }>(
				'/api/numbers/lookup/search',
				{ hash: hash },
				{ apikey: apikey, "Content-Type": "application/x-www-form-urlencoded" }
			);
			if ( response ) {
				return response.data;
			}
		} catch (error) {
			console.error("API Error:", error);
			return false;
		}
	}
}
