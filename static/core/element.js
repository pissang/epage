define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var $ = require("$");
    var _ = require("_");
    var onecolor = require("onecolor");

    var command = require("./command");

    var Draggable = qpf.mixin.Draggable;

    var Element = qpf.core.Clazz.derive(function(){
        
        return {

            name : "",

            icon : "",

            $wrapper : $("<div></div>"),

            type : "ELEMENT",

            properties : {

                id : {
                    label : "id",
                    field : "style",
                    ui : "textfield",
                    text : ko.observable("")
                },
                // className : {
                //     label : "class",
                //     ui : "text"
                // },
                // name : {
                //     label : "name",
                //     ui : "text"
                // },

                position : {
                    label : "位置",
                    ui : "vector",
                    field : "layout",
                    items : [{
                        name : "left",
                        type : "spinner",
                        value : ko.observable(0),
                        precision : 0,
                        step : 1
                    },{
                        name : "top",
                        type : "spinner",
                        value : ko.observable(0),
                        precision : 0,
                        step : 1
                    }]
                },

                size : {
                    label : "宽高",
                    ui : "vector",
                    field : "layout",
                    items : [{
                        name : "width",
                        type : "spinner",
                        value : ko.observable(100),
                        precision : 0,
                        step : 1
                    }, {
                        name : "height",
                        type : "spinner",
                        value : ko.observable(100),
                        precision : 0,
                        step : 1
                    }],
                    // constrainProportion : ko.observable(true),
                    constrainType : "ratio"
                },

                zIndex : {
                    label : "Z",
                    ui : "spinner",
                    field : 'layout',
                    value : ko.observable(0),
                    step : 1,
                    precision : 0
                },

                background : {
                    label : "背景",
                    ui : "checkbox",
                    field : "style",

                    checked : ko.observable(false)
                },

                backgroundColor : {
                    label : "背景色",
                    ui : "color",
                    field : "style",

                    color : ko.observable(0xffffff)
                },

                backgroundImageType : {
                    label : "背景图片",
                    ui : "combobox",
                    class : "small",
                    field : "style",
                    items : [{
                        text : "无",
                        value : "none"
                    }, {
                        text : "渐变",
                        value : "gradient"
                    }, {
                        text : "图片文件",
                        value : "file"
                    }],
                    value : ko.observable("none")
                },
                borderRadius : {
                    label : "圆角",
                    ui : "vector",
                    field : "style",
                    items : [{
                        name : "top-left",
                        type : "slider",
                        value : ko.observable(0),
                        precision : 0,
                        step : 1,
                        min : 0
                    }, {
                        name : "top-right",
                        type : "slider",
                        value : ko.observable(0),
                        precision : 0,
                        step : 1,
                        min : 0
                    }, {
                        name : "bottom-right",
                        type : "slider",
                        value : ko.observable(0),
                        precision : 0,
                        step : 1,
                        min : 0
                    }, {
                        name : "bottom-left",
                        type : "slider",
                        value : ko.observable(0),
                        precision : 0,
                        step : 1,
                        min : 0
                    }],
                    constrainProportion : ko.observable(true)
                }
                // rotation : {
                //     label : "旋转",
                //     name : "rotation",
                //     ui : "slider",
                //     type : "slider",
                //     value : ko.observable(0),
                //     precision : 0,
                //     max : 360,
                //     min : 0
                // }
                
            },

            onResize : function(){},
            onMove : function(){},

            onCreate : function(){},
            onRemove : function(){},

        }
    }, {

        initialize : function(config){
            var self = this,
                position = self.properties.position,
                size = self.properties.size;

            if(config && config.makeProperties){
                var properties = config.makeProperties();
                if(properties){
                    _.extend(self.properties, properties);
                }
            }
            
            if(config){
                _.extend(self, _.omit(config, "properties"));
            }

            var inCreate = true;
            // Left and top
            ko.computed({
                read : function(){
                    var left = position.items[0].value(),
                        top = position.items[1].value();
                    self.$wrapper.css({
                        left : left + "px",
                        top : top + "px"
                    })
                    // Dont trigger the event when the element is initializing
                    if( ! inCreate){
                        self.onMove(left, top);
                    };
                }
            });
            // Width and height
            ko.computed({
                read : function(){
                    var width = size.items[0].value(),
                        height = size.items[1].value();
                    self.resize(width, height);
                    if( ! inCreate){
                        self.onResize(width, height);
                    }

                    inCreate = false;
                }
            });
            // Z Index
            ko.computed({
                read : function(){
                    self.$wrapper.css({
                        'z-index' : self.properties.zIndex.value()
                    })
                }
            });
            // Border radius
            ko.computed({
                read : function(){
                    var br = self.properties.borderRadius.items;

                    self.$wrapper.css({
                        'border-radius' : _.map(br, function(item){
                            return item.value() + "px"
                        }).join(" ")
                    })
                }
            });
            // Background
            ko.computed({
                read : function(){
                    // If use background
                    var useBackground = self.properties.background.checked();
                    var backgroundColor = self.properties.backgroundColor.color();
                    if(useBackground){
                        self.$wrapper.css({
                            'background-color' : onecolor(backgroundColor).css()
                        })
                    }else{
                        self.$wrapper.css({
                            'background' : 'none'
                        })
                    }
                }
            });

            this.$wrapper.css({
                position : "absolute"
            });

            this.$wrapper.addClass("epage-" + this.type.toLowerCase());

            this.onCreate(this.$wrapper);

            if( ! this.properties.id.text()){
                this.properties.id.text(genID(this.type))
            }
        },

        syncPositionManually : function(){
            var left = parseInt(this.$wrapper.css("left"));
            var top = parseInt(this.$wrapper.css("top"));
            this.properties.position.items[0].value(left);
            this.properties.position.items[1].value(top);
        },

        rasterize : function(){

        },

        save : function(){

        },

        resize : function(width, height){
            this.$wrapper.width(width);
            this.$wrapper.height(height);
        },

        output : function(){

        },

        load : function(){

        }
    });
    
    var id = {};
    function genID(type){
        if(!id[type]){
            id[type] = 0;
        }
        return type + "_" + id[type]++;
    }

    function genGUID(type){

    }
    
    return Element;
})