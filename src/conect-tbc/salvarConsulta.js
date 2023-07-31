function salvarConsulta(url, user, passWord, codColigada, codSistema, codSentenca, titleSentenca, conteudoSentenca) {
    const https = require('https')
    const http = require('http');
    const x2jsrequire = require('x2js');
    const x2js = new x2jsrequire();
    const timeoutDuration = 20000;

    const xml = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tot="http://www.totvs.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <tot:SaveRecord>
            <!--Optional:-->
            <tot:DataServerName>GlbConsSqlData</tot:DataServerName>
            <!--Optional:-->
            <tot:XML><![CDATA[
                    <GlbConsSql>
                    <GConsSql>
                        <CODCOLIGADA>${codColigada}</CODCOLIGADA>
                        <APLICACAO>${codSistema}</APLICACAO>
                        <CODSENTENCA>${codSentenca}</CODSENTENCA>
                        <TITULO>${titleSentenca}</TITULO>
                        <SENTENCA>${conteudoSentenca}</SENTENCA>  
                        <DISPONIVELFILTRO>1</DISPONIVELFILTRO>
                        <DISPONIVELRELATORIO>1</DISPONIVELRELATORIO>
                        <DISPONIVELVISAO>1</DISPONIVELVISAO>
                        <DISPONIVELMENU>0</DISPONIVELMENU>
                        <SEMSEGCOLUNAS>0</SEMSEGCOLUNAS>
                        <SEMSEGESTENDIDA>0</SEMSEGESTENDIDA>
                    </GConsSql>
                        </GlbConsSql>]]></tot:XML>
            <!--Optional:-->
            <tot:Contexto>codcoligada=${codColigada};codfilial=1;codsistema=${codSistema};codusuario=${user}</tot:Contexto>
        </tot:SaveRecord>
        </soapenv:Body>
    </soapenv:Envelope>`;


    const config = {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${user}:${passWord}`).toString('base64'),
            'Content-Type': 'text/xml',
            SOAPAction: `http://www.totvs.com/IwsDataServer/SaveRecord`
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
            console.log(xml)
            return json.Envelope.Body
        } catch (error) {
            return 'Erro na solicitação SOAP:' + error
        }
    };
    return myAction();
}
module.exports = salvarConsulta