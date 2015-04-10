var url = require('url');

function router() { 
    var router = this;
    router.routes = [];
    router.knownMatches = {};
    return router;
}

router.prototype.createRouter = function() { 
    var router = this;
    return router.create();
}

router.prototype.create = function() {
    var router = this;
    
    return router.listener.bind(router); 
} 

router.prototype.listener = function(req, res) {
    var router = this;
    
    var matchedRoute = router.matchRoute(req); 
    matchedRoute.handler(req, res);
}


router.prototype.addRoute = function(route) { 
    var router = this;

    router.routes.push(route);
}

router.prototype.matchRoute = function(req) {
    var router = this;

    var path = url.parse(req.url).pathname;

    if(router.knownMatches[path]) {
      return router.knownMatches[path];
    } 

    for(var i = 0; i < router.routes.length; i++) {
        if(router.routes[i].matcher(path)) { 
            return router.routes[i];
        }
    }

    return router.notFound;
} 

router.prototype.createRoute = {
    plain : plainRoute
} 

function plainRoute(route, handler) {
    console.log('making a plain route');
    return { 
      matcher : function(path) {
        return path === route;
      },
      handler : handler
    }
} 

router.prototype.notFound = { 
    handler : function(req, res) {  
        var content = "Not Foundeded";
        res.writeHead(404, 'Not Found', {'Content-Type': 'text/plain', 'Content-Length': content.length});
        res.write(content);
        res.end();
    }
}

module.exports = exports = new router();
