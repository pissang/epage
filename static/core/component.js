define(function(require){

    var Element = require("./element");
    var koMapping = require("ko.mapping");
    var _ = require("_");

    var repository = {};

    var componentFactory = {

        register : function(name, config){
            repository[name] = config;
        },

        create : function(name, properties){

            var el = new Element();

            var config = repository[name];

            el.initialize(config);

            if(properties){
                koMapping.fromJS(properties, {}, el.properties);
            }

            return el;
        }
    }

    return componentFactory;
})