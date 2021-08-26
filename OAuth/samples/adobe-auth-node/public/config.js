/* Replace "YOUR_ADOBE_API_KEY" with your Api key 
and "YOUR_ADOBE_API_SECRET" with your API Secret */

// const adobeApiKey = process.env.API_KEY;
// const adobeApiSecret = process.env.API_SECRET;

const adobeApiKey = "f72a2329415f4e3ca13718646adfc0d6"
const adobeApiSecret = "p8e-oC-h3Zk8Ta1Yu8XJVb2ZBRlicRntYArw"

try {
        if (module) {
                module.exports = {
                        adobeApiKey: adobeApiKey,
                        adobeApiSecret: adobeApiSecret,
                }
        }
}
catch (err) {}
