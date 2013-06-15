define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var componentFactory = require("core/component");
    var command = require("core/command");
    var Module = require("../module");
    var xml = require("text!./hierarchy.xml");
    var _ = require("_");
    var List = require("modules/common/list");

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

        selectElements : function(data){
            hierarchy.selectedElements(_.map(data, function(item){
                return item.target;
            }));
        }
    });

    command.register("create", {
        execute : function(name, properties){
            var element = componentFactory.create(name, properties);
            element.$wrapper.mousedown(function(){
                hierarchy.selectedElements([element]);
            })

            hierarchy.elementsList.push({
                id : element.properties.id.text,
                target : element
            });

            propertyModule.showProperties(element.properties);

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
            propertyModule.showProperties(lastSelectedElement.properties);
        }
        hierarchy.trigger("select", selectedElements);


    });

    
    return hierarchy;
})