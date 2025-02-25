## PesaPress Lookup

### Goal

Make it easy to integrate [PesaPress](https://www.pesapress.com) number lookup service into any application to enable number hash decoding.
Easy registration with only an email and get your number hash decoded.

### Usage

###### Install

```shell
$ npm install pesapress-lookup
```

###### Setup
```javascript

const { PesaPressLookup } = require('pesapress');
const pesapress = new PesaPressLookup();
```

###### Register email to get API key
Register a new API key using your email.
The API key will only be shown **once** and should be saved somewhere

```javascript

const resp = await pesapress.register('myemail@domain.com')

if ( resp ) {
	resp.apikey; // api key
	resp.dailyCredits; // daily credits
	resp.remainingCredits; // remaining daily credits
} else {
	// Error that email already exists
}
```

###### Check remaining credits
Check the remaining account credits

```javascript

const resp = await pesapress.status('YOURAPIKEY')

if ( resp ) {
	resp.dailyCredits; // daily credits
	resp.remainingCredits; // remaining daily credits
} else {
	// Error that api key is invalid
}
```

###### Get mobile number from hash
Check for a mobile number from a hash.

```javascript

const resp = await pesapress.search('YOURAPIKEY', 'MOBILENUMBER_HASH')

if ( resp ) {
	resp.msisdn; // The decoded number
	resp.hashed; // The original hash
} else {
	// Error that api key is invalid
}
```

### Contributing

1. Fork this repo and make changes in your own fork.
2. Commit your changes and push to your fork `git push origin master`
3. Create a new pull request and submit it back to the project.


### Bugs & Issues

To report bugs (or any other issues), use the [issues page](https://github.com/pesapress/pesapress-lookup/issues).
