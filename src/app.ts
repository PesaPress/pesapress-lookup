import { ApiClient } from "./api";

export class PesaPressLookup {

	private apiClient: ApiClient;

	constructor() {
		this.apiClient = new ApiClient({ baseURL : 'https://api.pesapress.com'});
	}

	/**
	 * Search by api key. Search for the hash
	 * @param {string} hash The msisdn hashs
	 * @returns 
	 */
	async search( hash : string ) {
		try {
			const response = await this.apiClient.postForm<{ data: object }>(
				'/api/numbers/lookup/query',
				{ hash: hash },
				{ "Content-Type": "application/x-www-form-urlencoded" }
			);
			if ( response ) {
				return response.data;
			}
		} catch (error) {
			return false;
		}
	}
}
