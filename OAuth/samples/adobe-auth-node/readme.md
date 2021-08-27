# OAuth 2.0 Example: Node.js

This sample app will show you how to implement Adobe OAuth 2.0 using Node.js.

After setting up the sample, you will have a Node.js app that:

1. Runs on `https://localhost:8000`
1. Lets a user log in with their Adobe ID
1. Prompts the user to authorize the app with requested scopes
1. Lets the user view their Adobe ID profile information
1. Lets the user log out


<!-- $ doctoc ./readme.md --title "## Contents" --entryprefix 1. --gitlab --maxlevel 3 -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [OAuth 2.0 Example: Node.js](#oauth-20-example-nodejs)
  - [Contents](#contents)
  - [GitHub](#github)
  - [Technology Used](#technology-used)
  - [Prerequisites](#prerequisites)
  - [Configuration](#configuration)
    - [Install Node.js packages](#install-nodejs-packages)
    - [Store your Adobe API credentials as Environment Variables](#store-your-adobe-api-credentials-as-environment-variables)
    - [Create an OpenSSL cert](#create-an-openssl-cert)
  - [Usage](#usage)
  - [Other Resources](#other-resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## GitHub

You can find a companion repo for this developer guide [on GitHub](https://github.com/adobeio/adobeio-documentation/tree/master/auth/OAuth2.0Endpoints/samples/adobe-auth-node).

Be sure to follow all instructions in the `readme`.

## Technology Used

1. Node.js and the `npm` package manager
1. OpenSSL CLI

## Prerequisites

This guide will assume that you have read the [Adobe OAuth 2.0 Guide for Web](../../web-oauth2.0-guide.md).

You must also have [a registered app on the Adobe Developer Console](../../web-oauth2.0-guide.md#register-your-application-and-enable-apis) with the following settings:

1. `Platform`: web
1. `Default redirect URI`: `https://localhost:8000/callback/`
1. `Redirect URI Pattern`: `https://localhost:8000/callback/`

## Configuration

The following steps will help you get this sample up and running.

### Install Node.js packages

The `package.json` file contains a list of dependencies. Run the following command from the top level directory of the app to install these dependencies:

```
$ npm install
```

### Store your Adobe API credentials as Environment Variables

Set up a `.env` file to store the API Key and Secret. Create it on the same level as the `package.json` file -- you should see that it is already included in the `.gitignore` file to ensure that our source control history won't contain references to your secrets.   

```
API_KEY=######################
API_SECRET=###################
```

Then `public/config.js` will require the `dotenv` package and execute the `config` function, which reads the `.env` file and sets your environment variables:

```javascript
const dotenv = require('dotenv');
dotenv.config();
const adobeApiKey = process.env.API_KEY;
const adobeApiSecret = process.env.API_SECRET;

try {
  if (module) {
    module.exports = {
      adobeApiKey: adobeApiKey,
      adobeApiSecret: adobeApiSecret,
    }
  }
}
catch (err) {}
```

You can get your Adobe API Key and Secret from your registered app page on the [Adobe Developer Console](../../web-oauth2.0-guide.md#register-your-application-and-enable-apis).


### Create an OpenSSL cert

Adobe OAuth 2.0 requires SSL, so you will need to create a self-signed cert using the OpenSSL CLI. Be sure to run this in the `./server` directory:

```
$ cd server
$ mkdir CA && cd CA
$ openssl genrsa -out CA.key -des3 4096
```
This will generate a private key and request a simple passphrase of your choice. 
Now we can generate a root CA certificate using the key generated. Run the following line: 

```
$ openssl req -x509 -sha256 -new -nodes -days 3650 -key CA.key -out CA.pem
```
We have specified that the root CA certificate will be valid for 10 years. Now that we have the key and certificate, we can sign the SSL certificate isnce we already created CA. Create a new directory `localhost` inside of `CA` and create the file `localhost.ext` inside. We will store the information that needs to be written into the signed SSL certificate into this file

```
$ mkdir localhost && cd localhost && touch localhost.ext
```
Then modify the file like below: 
```
authorityKeyIdentifier = keyid,issuer
basicConstraints = CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
```

Next, we will generate a key and use the key to generate a CSR (Certificate Signing Request): 
```
$ openssl genrsa -out localhost,key -des3 4096
```
This will generate a localhost private key and request a passphrase. Then use the following command to generate the CSR: 

```
$ openssl req -new -key localhost.key -out localhost.csr
$ openssl x509 -req -in localhost.csr -CA ../CA.pem -CAkey ../CA.key -CAcreateserial -days 3650 -sha256 -extfile localhost.ext -out localhost.crt
$ openssl rsa -in localhost.key -out localhost.decrypted.key
```
This will take in the CSR (`localhost.csr`), the CA certification (`CA.pem` and `CA.key`), and the certificate extensions file (`localhost.ext`) to generate a `localhost.crt` certificate file, valid for ten years. The last line decrypts the `localhost.key` and stores that file. 

The final step is to tell your browser to trust the CA certificate. We have to import the certificate. 

In Chrome/Firefox, navigate to Settings/Options > Privacy and security > Managing SSL/View Certificates. Click on import and choose `CA.pem` then you should be able to run `https://localhost:8000` from Chrome or Firefox.

If this step fails, run the following line in your terminal to prompt an instance of Google Chrome with CORS disabled: 

```
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-securityopen -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```
Note that this method is not recommended in terms of security but will suffice as a quick workaround during development.


## Usage

After completing the configuration steps, start the server:

```
$ npm start
```

To access the app, go to `https://localhost:8000`. Click through any cert warnings in the browser.

## Other Resources

- [Adobe OAuth 2.0 Guide for Web](../../web-oauth2.0-guide.md)
