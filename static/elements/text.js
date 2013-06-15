define(function(require){

    var component = require("core/component");
    var ko = require("knockout");
    var onecolor = require("onecolor");

    component.register("text", {
        type : "TEXT",
        makeProperties : function(){
            return {
                text : {
                    label : "文本",
                    ui : "textfield",
                    text : ko.observable("请输入文字")
                },
                fontSize : {
                    label : "大小",
                    ui : "spinner",
                    value : ko.observable(16)
                },
                color : {
                    label : "颜色",
                    ui : "color",
                    color : ko.observable(0x000000)
                }
            }
        },
        onCreate : function($wrapper){
            var $text = $("<div></div>");
            var self = this;
            ko.applyBindings(this.properties, $text[0]);

            $wrapper.append($text);

            ko.computed(function(){
                var text = self.properties.text.text();
                var fontSize = self.properties.fontSize.value()+"px";
                var color = onecolor(self.properties.color.color()).css();

                $text.html(text)
                    .css({
                        "font-size" : fontSize,
                        "color" : color
                    })
            })
        }
    });
})