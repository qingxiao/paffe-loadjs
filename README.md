Paffe-loadjs
=============

简介
------------

Paffe-loadjs是为[Paffe](http://github.com/jsyczhanghao/Paffe "基于fis打造的一套定制版前端解决方案框架")提供一个前端模块化加载工具，遵循AMD规范，并提供require, define, require.async等相关接口，对js和css进行模块化管理，并可预设置模块的相关依赖进行模块依赖的并行加载，以提高前端的加载性能优化，且大小很小，整体代码包含注释不到300行左右。支持浏览器版本IE6+, firefox3.5+, chrome, safari, opera。


API
------------

* **define(modname, factory[, deps])**：定义一个模块, define依赖某一模块时 需要提供deps参数, deps参数可为数组或者字符串。

```js
define('mod/mod1/mod1.js', function(require, exports, module){
    module.exports = {
        name: 'mod1',
        desc: 'this is mod1'
    };
});
```

* **require(modname)**: 获取某一个模块

```js
define('mod/mod1/mod1.js', function(require, exports, module){
    var jquery = require('mod/jquery/jquery.js');
    
    module.exports = {
        name: 'mod1',
        desc: 'this is mod1',
        $: jquery
    };
}, 'mod/jquery/jquery.js');
```

* **require.async(modname[, callback])**: 调用某一个模块， 多个modname则使用数组表示，callback为记载完所有的模块后执行的回调函数。
```js
require.async('mod/mod1/mod1.js', function(Mod1){
    console.log(Mod1);
});
```

* **require.config**: 配置全局。
```js
//配置domain参数，所有的请求发出时会自动带上domain参数
require.config.domain = 'http://github.com/';

//map表，用于将模块合并打包，表示包于各模块的对应关系，并当require某一个模块时，会自动发送请求至map的key值url上。
require.config.map = {
    'pkg/mod.js': ['mod/mod1/mod1.js', 'mod/jquery/jquery.js']
};
```


