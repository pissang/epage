define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var Meta = qpf.components.meta.Meta;
    var onecolor = require("onecolor");

    var palette = new qpf.components.widget.Palette();
    palette.width(370);
    var popup = new qpf.components.container.Window();
    popup.title("调色器");
    popup.id("Palette");
    popup.add(palette);

    document.body.appendChild(popup.$el[0]);
    popup.$el.css({
        display : "none",
        'z-index' : "10000"
    })
    popup.render();

    var Color = Meta.derive(function(){
        var ret = {
            color : ko.observable(0xffffff)
        }
        ret._colorStr = ko.computed(function(){
            return onecolor(ret.color()).hex();
        })
        return ret;
    }, {

        type : 'COLOR',

        css : 'color',

        template : '<div data-bind="text:_colorStr" class="qpf-color-hex"></div>\
                    <div class="qpf-color-preview" data-bind="style:{backgroundColor:_colorStr()}"></div>',

        initialize : function(){
            var self = this;

            this.$el.click(function(){
                self.showPalette();
            });
        },

        showPalette : function(){
            popup.$el.css({
                display : "block",
                left : '300px',
                top : '100px'
            });
            palette.on("change", this._paletteChange, this);
            palette.on("cancel", this._paletteCancel, this);
            palette.on("apply", this._paletteApply, this);

            palette.set(this.color());
        },

        _paletteChange : function(hex){
            this.color(hex);
        },
        _paletteCancel : function(){
            popup.$el.css("display", "none");
            palette.off("change");
            palette.off("apply");
            palette.off("cancel");
        },
        _paletteApply : function(){
            this._paletteCancel();
        }
    });

    Meta.provideBinding("color", Color);

    return Color;
})