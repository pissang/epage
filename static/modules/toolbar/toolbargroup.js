define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var _ = require("_");


    var ToolbarGroup = qpf.components.container.Inline.derive(function(){
        return {}
    }, {
        type : "TOOLBARGROUP",
        css : "toolbar-group"
    });

    qpf.components.container.Container.provideBinding("toolbargroup", ToolbarGroup);

    return ToolbarGroup;
})