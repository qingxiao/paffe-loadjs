Paffe-loadjs
=============

简介
------------

Paffe-loadjs是为[Paffe](http://github.com/jsyczhanghao/Paffe "基于fis打造的一套定制版前端解决方案框架")提供一个前端模块化加载工具，遵循AMD规范，并提供require, define, require.async等相关接口，对js和css进行模块化管理，并可预设置模块的相关依赖进行模块依赖的并行加载，以提高前端的加载性能优化。


API
------------

* **define**：定义一个模块

```js
define('mod/mod1/mod1.js', function(require, exports, module){
    module.exports = {
        name: 'mod1',
        desc: 'this is mod1'
    };
});
```
