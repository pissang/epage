define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var Meta = qpf.use("meta/meta");

    var Viewport = Meta.derive(function(){
        return {
            scale : ko.observable(1.0)
        }
    }, {
        type : 'VIEWPORT',
        css : "viewport",

        template : '<div class="qpf-viewport-elements-container"></div>\
                    <div class="qpf-viewport-ruler-h"></div>\
                    <div class="qpf-viewport-ruler-v"></div>',

        initialize : function(){
            this.scale.subscribe(this._scale, this);
            this._scale(this.scale());
        },

        afterRender : function(){
            this._$elementsContainer = this.$el.find(".qpf-viewport-elements-container");
        },     

        addElement : function(el){
            if(this._$elementsContainer){
                this._$elementsContainer.append(el.$wrapper);
            }
        },

        _scale : function(val){
            this.$el.css({
                "-webkit-transform" : "scale(" + val + "," + val +")",
                "-moz-transform" : "scale(" + val + "," + val +")",
                "-o-transform" : "scale(" + val + "," + val +")",
                "transform" : "scale(" + val + "," + val +")"
            });
        }
    })

    Meta.provideBinding("viewport", Viewport);

    return Viewport;
})