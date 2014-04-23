define(function(require){

    var qpf = require("qpf");
    var Button = qpf.use("meta/Button");
    var Meta = qpf.use("meta/Meta");
    var ko = require("knockout");

    var IconButton = Button.derive(function(){
        return {
            $el : $("<div></div>"),
            icon : ko.observable("")
        }
    }, {
        type : "ICONBUTTON",
        css : _.union("icon-button", Button.prototype.css),

        template : '<div class="qpf-icon" data-bind="css:icon"></div>',
    })

    Meta.provideBinding("iconbutton", IconButton);

    return IconButton;

})