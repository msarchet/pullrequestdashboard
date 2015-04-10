var http = require('http'),
    router = require('./router.js'),
    url  = require('url'),
    request = require('request');

var redirectRoute = router.createRoute.plain('/redirect', function(req, res) { 
    var parsed = url.parse(req.url, true);  
    var code = parsed.code;

    // get the bear token and respond that to the user
    request.post('https://app.vssps.visualstudio.com/oauth2/token').form({
        client_assertion_type : 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: process.env.appsecret,
        grant_type : 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion : code,
        redirect_url : req.hostname + '/oauth'
    }).pipe(res);

});

router.addRoute(redirectRoute);

var listener = http.createServer(router.createRouter());

listener.listen(process.env.port || 8080);
