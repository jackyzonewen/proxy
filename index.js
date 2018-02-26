const AnyProxy = require('anyproxy');
const options = {
    /*忽略请求过程中的证书错误*/
    dangerouslyIgnoreUnauthorized: true,
    port: 8001,
    rule: {
        /*请求发起前会被调用*/
        *beforeSendRequest(requestDetail) {
            var url = requestDetail.url
            var requestData = requestDetail.requestData.toString()
            if(url.indexOf("weixin2.ktvme.net:3015/index.php/Home/Index/api")!=-1){
                requestData=requestData.replace("=100&","=0.01&")
                console.log(requestData)
            }
            return {
                requestData:requestData
            }
        },
        /*返回true表示替换这个https请求的证书并且拦截*/
        *beforeDealHttpsRequest(){
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        },
        /*修改返回数据*/
        *beforeSendResponse(requestDetail, responseDetail) {
            const newResponse = responseDetail.response;
            var url = requestDetail.url
            return new Promise((resolve, reject) => {
                resolve({ response: newResponse });
            });
        },
    },
    webInterface: {
        enable: true,
        webPort: 8002,
        wsPort: 8003,
    },
    throttle: 10000,
    forceProxyHttps: true,
    silent: true
};
const proxyServer = new AnyProxy.ProxyServer(options);
proxyServer.start();
