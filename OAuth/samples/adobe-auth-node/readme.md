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
    - [Create an OpenSSL cert](#create-an-openssl-cert)
    - [Install Node.js packages](#install-nodejs-packages)
    - [Store your Adobe API credentials as Environment Variables](#store-your-adobe-api-credentials-as-environment-variables)
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

### Create an OpenSSL cert

Adobe OAuth 2.0 requires SSL, so you will need to create a self-signed cert using the OpenSSL CLI. Be sure to run this in the `./server` directory:

```
$ cd server
$ openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
```

Make sure that after running this command you have the `cert.pem` and `key.pem` files at the top level of the `.server` directory.

If this step fails, run the following line in your terminal to prompt an instance of Google Chrome with CORS disabled: 

```
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-securityopen -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```
Note that this method is not recommended in terms of security but will suffice as a quick workaround during development.

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



## Usage

After completing the configuration steps, start the server:

```
$ npm start
```

To access the app, go to `https://localhost:8000`. Click through any cert warnings in the browser.

## Other Resources

- [Adobe OAuth 2.0 Guide for Web](../../web-oauth2.0-guide.md)
