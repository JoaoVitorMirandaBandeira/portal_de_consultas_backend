function buscarConsulta(url, user, passWord, codColigada, codSistema, codSentenca) {
    const https = require('https')
    const http = require('http'); // Use the 'https' module instead of 'http'
    const x2jsrequire = require('x2js');
    const x2js = new x2jsrequire();
    const timeoutDuration = 20000;

    const xml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tot="http://www.totvs.com/">
        <soapenv:Header/>
        <soapenv:Body>
            <tot:ReadRecord>
                <!--Optional:-->
                <tot:DataServerName>GlbConsSqlData</tot:DataServerName>
                <!--Optional:-->
                <tot:PrimaryKey>${codColigada};${codSistema};${codSentenca}</tot:PrimaryKey>
                <!--Optional:-->
                <tot:Contexto>codcoligada=${codColigada};codfilial=1;codsistema=${codSistema};codusuario=${user}</tot:Contexto>
            </tot:ReadRecord>
        </soapenv:Body>
    </soapenv:Envelope>`;

    const config = {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${user}:${passWord}`).toString('base64'),
            'Content-Type': 'text/xml',
            SOAPAction: `http://www.totvs.com/IwsDataServer/ReadRecord`
        }
    };

    const soapRequestWithTimeout = (url, config, xml) => {
        const soapPromise = soapRequest(url, config, xml);
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Timeout: Request took too long')), timeoutDuration);
        });
        return Promise.race([soapPromise, timeoutPromise]);
    };

    const soapRequest = (url, config, xml) => {
        return new Promise((resolve, reject) => {
            const chunks = [];
            const protocol = url.startsWith("https") ? https : http;
            const request = protocol.request(url, config, response => {
                response.on('data', chunk => chunks.push(chunk));
                response.on('end', () => resolve(Buffer.concat(chunks).toString()));
            });
            request.on('error', reject);
            request.end(xml);
        });
    };

    const myAction = async () => {
        try {
            const response = await soapRequestWithTimeout(`${url}/wsDataServer/IwsDataServer`, config, xml);
            const json = x2js.xml2js(response);
            const stringXML = json.Envelope.Body.ReadRecordResponse.ReadRecordResult
            const sentence = x2js.xml2js(stringXML).GlbConsSql.GConsSql
            return sentence
        } catch (error) {
            return 'Erro na solicitação SOAP:' + error;
        }
    };
    return myAction();
}
module.exports = buscarConsulta