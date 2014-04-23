define(function(require){

    var qpf = require("qpf");
    var  _ = require("_");

    var appXML = require("text!modules/app.xml");
    var router = require("modules/router");
    var controllerConfig = require("./controllerConfig");
    var notifier = qpf.use("core/mixin/notifier");

    function start(){
        var ko = require("knockout");
        var XMLParser = qpf.use("core/XMLParser");

        var dom = XMLParser.parse(appXML);

        document.body.appendChild( dom );
        
        ko.applyBindings(controllerConfig, dom);
        
        router.init("/");
    }

    var app = {
        start : start
    }
    _.extend(app, notifier);

    return app;
})