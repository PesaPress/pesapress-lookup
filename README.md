## PesaPress Lookup

[![NPM](https://nodei.co/npm/pesapress-lookup.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.org/package/pesapress-lookup)

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


###### Get mobile number from hash
Check for a mobile number from a hash.

```javascript

const resp = await pesapress.search('MOBILENUMBER_HASH')

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
