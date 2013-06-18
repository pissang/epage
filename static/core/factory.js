define(function(require){

    var Element = require("./element");
    var koMapping = require("ko.mapping");
    var _ = require("_");

    var factory = {};

    var repository = {};

    var componentFactory = {

        register : function(name, config){
            factory[name] = config;
        },

        create : function(name, properties){

            var el = new Element();
            repository[el.eid] = el;

            var config = factory[name];

            el.initialize(config);

            if(properties){
                koMapping.fromJS(properties, {}, el.properties);
                delete el.properties['__ko_mapping__'];
            }

            return el;
        },

        getElementByEID : function(eid){
            return repository[eid];
        },

        delete : function(){

        }
    }

    return componentFactory;
})