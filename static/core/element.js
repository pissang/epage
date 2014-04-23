define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var $ = require("$");
    var _ = require("_");
    var onecolor = require("onecolor");
    var koMapping = require("ko.mapping");

    var command = require("./command");

    var Draggable = qpf.helper.Draggable;

    var Element = qpf.core.Clazz.derive(function(){
        
        var hasBackground = ko.observable(false);
        var isBackgroundImageGradient = ko.computed({
            read : function(){
                return hasBackground() &&
                    ret.properties.backgroundImageType() === 'gradient'
            },
            deferEvaluation : true
        });
        var isBackgroundImageFile = ko.computed({
            read : function(){
                return hasBackground() &&
                    ret.properties.backgroundImageType() === 'file'
            }
        })

        var ret = {

            name : "",
            icon : "",

            eid : genEID(),

            $wrapper : $('<div></div>'),

            type : "ELEMENT",

            // Properties view model
            properties : {
                id : ko.observable(""),
                
                width : ko.observable(100),
                height : ko.observable(100),
                left : ko.observable(0),
                top : ko.observable(0),

                zIndex : ko.observable(0),
                
                //-------------------
                // Background
                background : hasBackground,
                backgroundColor : ko.observable(0xffffff),
                backgroundImageType : ko.observable("none"),
                backgroundGradientStops : ko.observableArray([{
                    percent : ko.observable(0),
                    color : ko.observable('rgba(255, 255, 255, 1)')
                }, {
                    percent : ko.observable(1),
                    color : ko.observable('rgba(0, 0, 0, 1)')
                }]),
                backgroundGradientAngle : ko.observable(180),

                //-------------------
                // Border radius
                borderTopLeftRadius : ko.observable(0),
                borderTopRightRadius : ko.observable(0),
                borderBottomRightRadius : ko.observable(0),
                borderBottomLeftRadius : ko.observable(0),

                //-------------------
                // Shadow
                hasShadow : ko.observable(false),
                shadowOffsetX : ko.observable(0),
                shadowOffsetY : ko.observable(0),
                shadowBlur : ko.observable(10),
                shadowColor : ko.observable(0),

                //-------------------
                // Border


                link : ko.observable("")
            },

            onResize : function(){},
            onMove : function(){},

            onCreate : function(){},
            onRemove : function(){},

            onExport : function(){},
            onImport : function(){},

            onOutput : function(){}

        }

        // UI Config for property Panel
        var props = ret.properties;
        ret.uiConfig = {
            id : {
                label : "id",
                field : "style",
                ui : "textfield",
                text : props.id
            },
            position : {
                label : "位置",
                ui : "vector",
                field : "layout",
                items : [{
                    name : "left",
                    type : "spinner",
                    value : props.left,
                    precision : 0,
                    step : 1
                },{
                    name : "top",
                    type : "spinner",
                    value : props.top,
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
                    value : props.width,
                    precision : 0,
                    step : 1
                }, {
                    name : "height",
                    type : "spinner",
                    value : props.height,
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
                value : props.zIndex,
                step : 1,
                precision : 0
            },

            background : {
                label : "背景",
                ui : "checkbox",
                field : "style",

                checked : hasBackground
            },

            backgroundColor : {
                label : "背景色",
                ui : "color",
                field : "style",

                color : props.backgroundColor,

                visible : hasBackground
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
                value : props.backgroundImageType,

                visible : hasBackground
            },

            backgroundGradient : {
                ui : "gradient",
                field : "style",
                stops : props.backgroundGradientStops,
                angle : props.backgroundGradientAngle,

                visible : isBackgroundImageGradient
            },

            borderRadius : {
                label : "圆角",
                ui : "vector",
                field : "style",
                items : [{
                    name : "top-left",
                    type : "slider",
                    value : props.borderTopLeftRadius,
                    precision : 0,
                    step : 1,
                    min : 0
                }, {
                    name : "top-right",
                    type : "slider",
                    value : props.borderTopRightRadius,
                    precision : 0,
                    step : 1,
                    min : 0
                }, {
                    name : "bottom-right",
                    type : "slider",
                    value : props.borderBottomRightRadius,
                    precision : 0,
                    step : 1,
                    min : 0
                }, {
                    name : "bottom-left",
                    type : "slider",
                    value : props.borderBottomLeftRadius,
                    precision : 0,
                    step : 1,
                    min : 0
                }],
                constrainProportion : ko.observable(true)
            },

            shadow : {
                label : "阴影",
                ui : "checkbox",
                field : "style",

                checked : props.hasShadow
            },

            shadowSize : {
                field : "style",
                ui : "slider",
                min : 1,
                max : 100,
                precision : 0,
                value : props.shadowBlur,
                visible : props.hasShadow
            },

            shadowOffset : {
                ui : "vector",
                field : "style",
                items : [{
                    name : "shadowOffsetX",
                    type : "slider",
                    min : -100,
                    max : 100,
                    precision : 0,
                    value : props.shadowOffsetX
                }, {
                    name : "shadowOffsetY",
                    type : "slider",
                    min : -100,
                    max : 100,
                    precision : 0,
                    value : props.shadowOffsetY
                }],
                visible : props.hasShadow
            },

            shadowColor : {
                ui : "color",
                field : "style",
                color : props.shadowColor,
                visible : props.hasShadow
            },

            link : {
                label : "超链接",
                ui : "textfield",
                value : props.link
            }
        };

        return ret;
    }, {

        initialize : function(config){

            this.$wrapper.attr("data-epage-eid", this.eid);

            var self = this,
                properties = self.properties;

            if(config){
                if(config.extendProperties){
                    var extendedProps = config.extendProperties.call(this);
                    if(extendedProps){
                        _.extend(properties, extendedProps);
                    }
                }
                // Extend UI Config in the properties panel
                if(config.extendUIConfig){
                    var extendedUIConfig = config.extendUIConfig.call(this);
                    if(extendedUIConfig){
                        _.extend(this.uiConfig, extendedUIConfig);
                    }
                }
            }
            
            if(config){
                _.extend(self, _.omit(config, "properties"));
            }

            var inCreate = true;
            // Left and top
            ko.computed({
                read : function(){
                    var left = properties.left(),
                        top = properties.top();
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
                    var width = properties.width(),
                        height = properties.height();
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
                        'z-index' : self.properties.zIndex()
                    })
                }
            });
            // Border radius
            ko.computed({
                read : function(){
                    var br = self.uiConfig.borderRadius.items;

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
                    var useBackground = self.properties.background();
                    var backgroundColor = self.properties.backgroundColor();
                    if(useBackground){
                        // Background color
                        self.$wrapper.css({
                            'background-color' : onecolor(backgroundColor).css()
                        });
                        // No background image
                        switch(self.properties.backgroundImageType()){
                            case "none":
                                self.$wrapper.css({
                                    'background-image' : 'none'
                                });
                                break;
                            case 'gradient':
                                // Gradient background image
                                var stops = self.properties.backgroundGradientStops();
                                var angle = self.properties.backgroundGradientAngle();
                                var cssStr = 'linear-gradient(' + angle + 'deg, '+ 
                                            _.map(stops, function(stop){
                                                return onecolor(stop.color()).cssa() 
                                                        + ' ' 
                                                        + Math.floor(stop.percent() * 100) + '%';
                                            }).join(", ") + ')';

                                self.$wrapper.css({
                                    'background-image' : '-webkit-' + cssStr,
                                    'background-image' : '-moz-' + cssStr,
                                    'background-image' : cssStr
                                });
                                break;
                        }
                    }else{
                        self.$wrapper.css({
                            'background' : 'none'
                        })
                    }
                }
            });

            // Shadow
            ko.computed({
                read : function(){
                    var props = self.properties;
                    var shadowOffsetX = Math.floor(props.shadowOffsetX())+"px",
                        shadowOffsetY = Math.floor(props.shadowOffsetY())+"px",
                        shadowBlur = Math.floor(props.shadowBlur())+"px",
                        shadowColor = Math.floor(props.shadowColor());

                    if(shadowBlur && props.hasShadow()){
                        self.$wrapper.css({
                            'box-shadow' : [shadowOffsetX, shadowOffsetY, shadowBlur, onecolor(shadowColor).css()].join(' ')
                        })
                    }else{
                        self.$wrapper.css({
                            'box-shadow' : 'none'
                        })
                    }
                }
            })

            this.$wrapper.css({
                position : "absolute"
            });

            this.$wrapper.addClass("epage-element epage-" + this.type.toLowerCase());

            this.onCreate(this.$wrapper);

            if( ! this.properties.id()){
                this.properties.id(genID(this.type))
            }
        },

        syncPositionManually : function(){
            var left = parseInt(this.$wrapper.css("left"));
            var top = parseInt(this.$wrapper.css("top"));
            this.properties.left(left);
            this.properties.top(top);
        },

        resize : function(width, height){
            this.$wrapper.width(width);
            this.$wrapper.height(height);
        },
        
        rasterize : function(){},

        export : function(){
            var json = {
                eid : this.eid,
                type : this.type,
                properties : koMapping.toJS(this.properties),
                assets : {
                    // key is the image name
                    // value is the image base64 Url
                    images : {}
                }
            };

            this.onExport(json);

            return json;
        },

        import : function(json){
            koMapping.fromJS(json.properties, {}, this.properties);
            delete this.properties['__ko_mapping__'];
            this.onImport(json);
        },

        makeAsset : function(type, name, data, root){
            var globalName = this.eid + "#" + name;
            if( ! root[type]){
                root[type] = {};
            }
            root[type][globalName] = {
                data : data,
                type : type
            };
            return "url(" + type + "/" + globalName + ")";
        },

        build : function(){}
    });
    
    var id = {};
    function genID(type){
        if(!id[type]){
            id[type] = 0;
        }
        return type + "_" + id[type]++;
    }

    var eid = 1;
    function genEID(){
        return eid++;
    }
    
    return Element;
})