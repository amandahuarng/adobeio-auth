/* 
Create a .env file and store your API Key and API Secret. 
The .env file is already included in the .gitignore file to ensure that they aren't accidentally put into source control.
 */
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
