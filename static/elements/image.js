define(function(require){

    var component = require("core/component");
    var ko = require("knockout");
    var _ = require("_");

    component.register("image", {
        type : "IMAGE",
        makeProperties : function(){
            return {
                src : {
                    value : ko.observable("")
                }
            }
        },
        onCreate : function($wrapper){
            var img = document.createElement("img");
            var self = this;

            var updateImageSize = _.throttle(function(width, height){
                img.width = width;
                img.height = height;
            }, 1);
            // Size of image;
            ko.computed(function(){
                var width = self.properties.size.items[0].value(),
                    height = self.properties.size.items[1].value();
                if(img.src && img.complete){
                    updateImageSize(width, height);
                }
            });
            ko.computed(function(){
                img.onload = function(){
                    var width = img.width,
                        height = img.height;
                    self.properties.size.items[0].value(width);
                    self.properties.size.items[1].value(height);
                    img.onload = null;
                }
                img.src = self.properties.src.value();
            });
            // Border radius
            ko.computed({
                read : function(){
                    var br = self.properties.borderRadius.items;

                    $(img).css({
                        'border-radius' : _.map(br, function(item){
                            return item.value() + "px"
                        }).join(" ")
                    })
                }
            });
            $wrapper.append(img);
        }
    })
})