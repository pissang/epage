define(function(require){

    var qpf = require("qpf");
    var ko = require("knockout");
    var Module = require("../module");
    var xml = require("text!./toolbar.xml");
    var command = require("core/command");
    var $ = require("$");
    //
    var hierarchyModule = require("../hierarchy/index");
    var viewportModule = require("../viewport/index");

    var $fileInput = $("<input type='file' />");

    require("./toolbargroup");

    var toolbar = new Module({
        name : "toolbar",
        xml : xml,

        createElement : function(){
            command.execute("create");
        },
        createImage : function(){
            $fileInput.click();
        },
        createText : function(){
            command.execute("create", "text");
        },

        zoomIn : function(){
            var scale = viewportModule.viewportScale();
            viewportModule.viewportScale( Math.min( Math.max(scale+0.1, 0.2), 1.5) );
        },

        zoomOut : function(){
            var scale = viewportModule.viewportScale();
            viewportModule.viewportScale( Math.min( Math.max(scale-0.1, 0.2), 1.5) );
        },

        viewportScale : ko.computed(function(){
            return Math.floor(viewportModule.viewportScale() * 100) + "%";
        })
    });

    var imageReader = new FileReader();
    $fileInput[0].addEventListener("change", function(e){
        var file = e.target.files[0];
        if(file && file.type.match(/image/)){
            imageReader.onload = function(e){
                imageReader.onload = null;
                command.execute("create", "image", {
                    src : {
                        value : e.target.result
                    }
                })
            }
            imageReader.readAsDataURL(file);
        }
    })

    require("elements/image");
    require("elements/text");

    return toolbar;
})