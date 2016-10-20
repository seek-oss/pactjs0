var http = require('http');
var webserver;
var urlPattern = new RegExp('(http|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?')

function setup(app, cb){
    function cbProxy(err, server) {
        cb(err, 'http://localhost:' + webserver.address().port)
    }
    if(!app){
        throw new Error('No webserver defined');
    }
    // Caller has started the app externally. Just use the url they gave you.
    else if (typeof app === 'string' && urlPattern.test(app)) {
        cb(null, app)
    }
    //Express and similar compatible apps have the 'listen' method defined
    else if (!!app.listen){
        webserver = app.listen(0, cbProxy);
    }
    //it might be koa or else unknown
    else if(app.hasOwnProperty('env')){
            // It appears to be koa:
            // https://github.com/wilmoore/node-supertest-koa-agent
            webserver = http.createServer(app.callback());
            webserver.listen(0, cbProxy);
    }
    else {
        throw new Error('Unable to start app, couldn\'t identify or start up app');
    }
}

function teardown (cb) {
    webserver.close(cb);
}

module.exports = {
    setup: setup,
    teardown: teardown
};
