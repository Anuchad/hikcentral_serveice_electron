var crypto = require('crypto');
const https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false
});

function prepareConfigRequestToHCPAPI(appkey,secret,path){

    const stringSignature = `POST\n*/*\napplication/json\nx-ca-key:${appkey}\n${path}`

    const sign = crypto.createHmac('SHA256', secret).update(stringSignature).digest('base64');

    const configApi = {
        headers: {
            "Content-Type": "application/json",
            "X-Ca-Key": appkey,
            "X-Ca-Signature": sign,
            "X-Ca-Signature-Headers": "x-ca-key",
            "Accept": "*/*"
        },
        httpsAgent: agent
    }

    return configApi;
}

module.exports = {
    prepareConfigRequestToHCPAPI
}