define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var componentFactory = require("core/factory");
    var command = require("core/command");
    var Module = require("../module");
    var xml = require("text!./hierarchy.xml");
    var _ = require("_");

    var propertyModule = require("../property/index");

    var ElementView = require("./element");

    var hierarchy = new Module({
        name : "hierarchy",
        xml : xml,

        // Elements data source 
        // {
        //     id : [ko.observable()],
        //     target : [Element] 
        // }
        elementsList : ko.observableArray([]),

        // List of selected elements, support multiple select
        selectedElements : ko.observableArray([]),

        ElementView : ElementView,

        _selectElements : function(data){
            hierarchy.selectedElements(_.map(data, function(item){
                return item.target;
            }));
        },

        selectElementsByEID : function(eidList){
            var elements = [];
            _.each(eidList, function(eid){
                var el = componentFactory.getElementByEID(eid);
                if(el){
                    elements.push(el);
                }
            });
            hierarchy.selectedElements(elements);
        },

        load : function(elementsList){
            this.elementsList(_.map(elementsList, function(element){
                return {
                    id : element.properties.id,
                    target : element
                }
            }));
            _.each(elementsList, function(element){
                hierarchy.trigger("create", element);
            })
        }
    });

    hierarchy.elements = ko.computed({
        read : function(){
            return _.map(hierarchy.elementsList(), function(item){
                return item.target;
            });
        },
        deferEvaluation : true
    })

    command.register("create", {
        execute : function(name, properties){
            var element = componentFactory.create(name, properties);

            hierarchy.elementsList.push({
                id : element.properties.id,
                target : element
            });

            // Dispatch create event
            hierarchy.trigger("create", element);

            hierarchy.selectedElements([element]);
        },
        unexecute : function(name, properties){
            
        }
    });

    command.register("remove", {
        execute : function(){

        },
        unexecute : function(){

        }
    });

    ko.computed(function(){
        var selectedElements = hierarchy.selectedElements();
        var lastSelectedElement = selectedElements[selectedElements.length-1];
        if(lastSelectedElement){
            propertyModule.showProperties(lastSelectedElement.uiConfig);
        }
        hierarchy.trigger("select", selectedElements);


    });

    
    return hierarchy;
})