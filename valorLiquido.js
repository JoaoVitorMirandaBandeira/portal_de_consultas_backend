function valorLiquido(url, user, passWord, idLan, codColigada) {
    const https = require('https')
    const http = require('http'); // Use the 'https' module instead of 'http'
    const x2jsrequire = require('x2js');
    const x2js = new x2jsrequire();
    const timeoutDuration = 20000;

    const config = {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${user}:${passWord}`).toString('base64'),
            'Content-Type': 'text/xml',
            SOAPAction: 'http://www.totvs.com/IwsFin/ValorLiquido'
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
    const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tot="http://www.totvs.com/">
<soapenv:Header/>
<soapenv:Body>
   <tot:ValorLiquido>
      <!--Optional:-->
      <tot:xml><![CDATA[
 <TOTVSMessage>
 <MessageInformation>
 <UUID>ValorLiquido</UUID>
 <Type>BusinessMessage</Type>
 <Transaction>ValorLiquido</Transaction>
 </MessageInformation>
 <BusinessMessage>
 <BusinessEvent>
     <Entity>ValorLiquido</Entity>
     <Event>upsert</Event>
     <Identification>
     <key name="key1">IDFLAN</key>
     <key name="key2">CODCOLIGADA</key>
     </Identification>
 </BusinessEvent>
 <BusinessContent>
     <CompanyId>${codColigada}</CompanyId>
     <Code>${idLan}</Code>
     <User>${user}</User>
 </BusinessContent>
 </BusinessMessage>
 </TOTVSMessage>]]></tot:xml>
      <!--Optional:-->
      <tot:contexto>codcoligada=1;codfilial=1;codsistema=f;codusuario=rubeus;</tot:contexto>
   </tot:ValorLiquido>
</soapenv:Body>
</soapenv:Envelope>`;

    const myAction = async () => {
        try {
            const response = await soapRequestWithTimeout(url, config, xml);
            const json = x2js.xml2js(response);
            console.log(`Response:`, json.Envelope.Body);
            return json.Envelope.Body
        } catch (error) {
            console.log('Erro na solicitação SOAP:', error);
            return 'Erro na solicitação SOAP:' + error
        }
    };
    return myAction();
}

module.exports = valorLiquido