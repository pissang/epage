define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var _ = require("_");


    var ButtonGroup = qpf.components.container.Inline.derive(function(){
        return {
            
        }
    }, {
        type : "BUTTONGROUP",
        css : "button-group"
    });

    qpf.components.container.Container.provideBinding("buttongroup", ButtonGroup);

    return ButtonGroup;
})