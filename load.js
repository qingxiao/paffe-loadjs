var require, define;

(function(window, document){
//判断是否为数组
function isArray(array){
        return Object.prototype.toString.call(array) == '[object Array]';
}

//转换数组
function makeArray(array){
        return array ? isArray(array) ? array : [array] : [];
}

//简单迭代数组
function each(array, callback){
        for(var i = 0; i < array.length; i++)
                callback(array[i]);
}

function inArray(array, item){
        array = makeArray(array);

        if(array.indexOf){
                return array.indexOf(item) > -1;
        }else{
                for( var i = 0; i < array.length; i++){
                        if(array[i] == item) return true;
                }

                return false;
        }
}

function isFunction(callback){
        return typeof callback == 'function';
}

//模块主类
//modulename 模块名
//callback 执行的函数
//depth 依赖的js文件 ==> 可为数组
function Module(modulename, callback, depth, use){
        if(Module.cache[modulename]) throw new Error('module ' + modulename + ' is exists!');

        var self = this;

        //模块名
        self.modulename = modulename;
        self.callback = callback;
        //获取真实的依赖文件列表
        self.depths = Module.getDeps(depth);
        //所需要加载的依赖的模块数
        self.needLoadDepth = self.depths.length;
        //当模块所有依赖以及本身全部加载完后, 所通知的主模块列表
        self.notices = (Module.noticesCache[modulename] || {}).notices || [];
        //公开出的成员
        self.exports = {};
	    self.execed = false;
	    self.use = use;
        self.init();
}

Module.prototype = {
        init: function(){
                var self = this;

                //当模块类被实例话后表示该模块本身的js已经被成功加载 删除loading表中自身所对应的js
                Module.cache[self.modulename] = self;
                //如果没有依赖 直接complete
                self.needLoadDepth ? self.loadDepths() : self.complete();
        },

        //加载依赖
        loadDepths: function(){
                var self = this;

                self.status = Module.loadStatus.LOADDEPTH;

                each(self.depths, function(modulename){
                        Module.load(modulename, self.modulename);
                });
        },

        //接受通知
        //此处当依赖本模块的模块加载完后 会执行
        receiveNotice: function(){
                if(!--this.needLoadDepth) {
                        this.complete();
                }
        },

        //当本身加载完后 通知所依赖本模块的模块
        noticeModule: function(notice){
                var self = this;

                if(notice){
                        if(self.status != Module.loadStatus.LOADED){
                                return self.notices.push(notice);
                        }

                        Module.cache[notice].receiveNotice();
                }else{
                        each(self.notices, function(item){
                                Module.cache[item].receiveNotice();
                        });

                        self.notices.length = 0;
                }
        },

        //完成所有依赖加载后 执行回调
        complete: function(){
                var self = this;

                self.status = Module.loadStatus.LOADED;
		        self.use && self.exec();
                self.noticeModule();
        },

    	exec: function(){
    		var self = this;

    		if(self.execed) return;

    		self.execed = true;

    		if(isFunction(self.callback)){
                var exports;

                if(exports = self.callback.call(window, Module.require, self.exports, self)){
                        self.exports = exports;
                }
            }
    	}
};

//模块的加载状态
Module.loadStatus = {
        LOADDEPTH: 1,   //正在努力加载依赖文件
        LOADED: 2       //已全部加载完毕
};

Module.cache = {};      //当模块的js文件加载完后 会存放在此处 不管依赖是否加载完  这里是存放实例module
Module.noticesCache = {};       //缓存每个模块所需要通知被依赖模块的实例
Module.loadingSource = {};
Module.loadedSource = {};
Module.mapSource = {};

//加载一个模块的js文件
Module.load = function(path, notice){
        var cache, module;

        if(cache = Module.cache[path]) return cache.noticeModule(notice);

        if(module = Module.noticesCache[path]) return module.notices.push(notice);

        Module.noticesCache[path] = {notices: [notice]};

        var _path = Module.getFullPath(path), map;

        if(!(map = Module.mapSource[_path])){
                map = Module.mapSource[_path] = [];
        }

        map.push(path);

        if(!Module.loadingSource[_path]){
                Module.loadingSource[_path] = 1;

                var  
                isCss = /\.css$/.test(path),
                isLoaded = 0,
                isOldWebKit = +navigator.userAgent.replace(/.*(?:Apple|Android)WebKit\/(\d+).*/, "$1") < 536,
                source = document.createElement(isCss ? 'link' : 'script'),
                supportOnload = 'onload' in source;

                if(isCss){
                        source.rel = 'stylesheet';
                        source.type = 'text/css';
                        source.href = _path;
                }else{
                        source.type = 'text/javascript';
                        source.src = _path;
                }

                source.onload = source.onerror = source.onreadystatechange = onload;
                source.charset = require.config.charset;
                document.getElementsByTagName('head')[0].appendChild(source);

                if(isCss && (isOldWebKit || !supportOnload)){
                        var id = setTimeout(function(){
                                if(source.sheet){
                                        clearTimeout(id);
                                        return onload();
                                }

                                setTimeout(arguments.callee);
                        });
                }

                function onload(){
                        if(isLoaded) return;

                        Module.loadingSource[_path] = 1;

                        if(!source.readyState || source.readyState == 'loaded' || source.readyState == 'complete'){
                                isLoaded = 1;
                                source.onload = source.onerror = source.onreadystatechange = null;
                                Module.loaded(_path);
                        }
                }
        }else if(Module.loadedSource[_path]){
                Module.loaded(_path);
        }
};

Module.loaded = function(path){
        var map = Module.mapSource[path];

        each(map, function(p){
                !Module.cache[p] && new Module(p);
        });

        map.length = 0;
};

//require
Module.require = function(modulename){
	var cache = Module.cache[Module.getPath(modulename)];
	cache.exec();
    return cache.exports;
};

//或者模块真实的路径
Module.getPath = function(path){
        var config = require.config, baseurl = config.baseurl || '';

        each(config.rules || [], function(item){
                path = path.replace(item[0], item[1]);
        }); 

        if(baseurl && !/^\/|:\/\//.test(path)) path = baseurl.replace(/\/+$/, '') + '/' + path;

        return path.replace(/([^:])\/+/g, '$1/');
};

Module.getFullPath = function(path){
        var config = require.config, map = config.map || {}, domain = config.domain || '';

        for(var i in map){
                if(map.hasOwnProperty(i) && inArray(map[i], path)){
                        path = i; break;
                }
        }
        
        return !/:\/\//.test(path) ? domain + path : path;
};

Module.getDeps = function(deps){
        var d = [];

        each(makeArray(deps), function(dep){
                dep = Module.getPath(dep);
                d.push(dep);
                d.push.apply(d, Module.getDeps(require.config.deps[dep]));
        });

        return d;
};


var requireid = 0;

require = Module.require;

require.config = {
        domain: '',
        baseurl: '',
        rules: [],
        charset: 'utf-8',
        deps: {},
        map: {}
};

require.async = function(paths, callback){
        new Module('_r_' + requireid++, function(){
                var depthmodules = [];

                each(makeArray(paths), function(path){
                        depthmodules.push(Module.require(path));
                });

                isFunction(callback) && callback.apply(window, depthmodules);
        }, paths, true);
};

define = function(modulename, callback, depth){
        modulename = Module.getPath(modulename);
        depth = depth || require.config.deps[modulename];

        new Module(modulename, callback, depth);
};
})(window, document);
