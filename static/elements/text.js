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

                fontFamily : {
                    label : "字体",
                    ui : "combobox",
                    class : "small",
                    items : [
                        { text:'宋体',value:'宋体,SimSun'},
                        { text:'微软雅黑',value:'微软雅黑,Microsoft YaHei'},
                        { text:'楷体',value:'楷体,楷体_GB2312, SimKai'},
                        { text:'黑体',value:'黑体, SimHei'},
                        { text:'隶书',value:'隶书, SimLi'},
                        { text:'Andale Mono',value:'andale mono'},
                        { text:'Arial',value:'arial, helvetica,sans-serif'},
                        { text:'Arial Black',value:'arial black,avant garde'},
                        { text:'Comic Sans Ms',value:'comic sans ms'},
                        { text:'Impact',value:'impact,chicago'},
                        { text:'Times New Roman',value:'times new roman'}
                    ],
                    value : ko.observable("黑体, SimHei")
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
                },

                horzontalAlign : {
                    label : "水平对齐",
                    ui : "combobox",
                    class : "small",
                    items : [{
                        value : 'left',
                        text : "左对齐"
                    }, {
                        value : 'center',
                        text : "居中"
                    }, {
                        value : 'right',
                        text : "右对齐"
                    }],
                    value : ko.observable('center')
                },

                verticleAlign : {
                    label : "垂直对齐",
                    ui : "combobox",
                    class : "small",
                    items : [{
                        value : 'top',
                        text : "顶部对齐"
                    }, {
                        value : 'middle',
                        text : "居中"
                    }, {
                        value : 'bottom',
                        text : "底部对齐"
                    }],
                    value : ko.observable('middle')
                }
            }
        },

        onCreate : function($wrapper){
            var $text = $("<span style='line-height:normal;display:inline-block;vertical-align:middle;width:100%;'></span>");
            var self = this;
            ko.applyBindings(this.properties, $text[0]);

            $wrapper.append($text);

            //Font family
            ko.computed(function(){
                var fontFamily = self.properties.fontFamily.value();
                $text.css({
                    'font-family' : fontFamily
                })
            })

            //Font size and text color
            ko.computed(function(){
                var text = self.properties.text.text();
                var fontSize = self.properties.fontSize.value()+"px";
                var color = onecolor(self.properties.color.color()).css();

                $text.html(text)
                    .css({
                        "font-size" : fontSize,
                        "color" : color
                    })
            });

            //Text align
            ko.computed(function(){
                var verticleAlign = self.properties.verticleAlign.value();
                var horzontalAlign = self.properties.horzontalAlign.value();

                $text.css({
                    'text-align' : horzontalAlign,
                    'vertical-align' : verticleAlign
                })
            })

            ko.computed(function(){
                var height = self.properties.size.items[1].value();
                if(height){
                    $wrapper.css({
                        'line-height' : height + 'px'
                    })
                }
            })
        }
    });
})