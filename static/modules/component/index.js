define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var xml = require("text!./component.xml");

    var component = new Module({
        name : "component",
        xml : xml
    });
    
    return component;
})