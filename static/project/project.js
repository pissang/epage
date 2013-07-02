define(function(require){

    var _ = require("_");
    var factory = require("core/factory");

    var viewportModule = require("modules/viewport/index");
    var hierarchyModule = require("modules/hierarchy/index");

    function find(assets, path){
        var pathArr = path.split("/");
        var result = _.reduce(pathArr, function(memo, key){
            if(memo){
                return memo[key];
            }
        }, assets);

        return result && result.data;
    }

    return {
        import : function(json){

            function importAsset(parent){
                _.each(parent, function(item, key){
                    if(typeof(item) === "string"){
                        var result = /url\((\S*?)\)/.exec(item);
                        if(result){
                            var path = result[1];
                            var data = find(json.assets, path);
                            if(data){
                                parent[key] = data;
                            }
                        }
                    }else if(item instanceof Array || item instanceof Object){
                        importAsset(item);
                    }
                })
            }
            
            var elements = [];
            _.each(json.elements, function(item){
                importAsset(item.properties);
                var element = factory.create(item.type.toLowerCase());
                element.import(item);
                elements.push(element);
            });

            hierarchyModule.load(elements);
            viewportModule.viewportWidth(json.viewport.width);
            viewportModule.viewportHeight(json.viewport.height);
        },
        export : function(){
            var d = new Date();
            var result = {
                meta : {
                    date : d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate()
                },
                viewport : {
                    width : viewportModule.viewportWidth(),
                    height : viewportModule.viewportHeight()
                },
                elements : [],
                assets : {}
            }
            _.each(hierarchyModule.elements(), function(element){
                var json = element.export();
                result.elements.push(_.omit(json, 'assets'));

                _.each(json.assets, function(field, type){
                    _.each(field, function(item, name){
                        if( ! result.assets[type]){
                            result.assets[type] = {};
                        }
                        result.assets[type][name] = item;
                    });
                });
            });

            return result;
        }
    }
})