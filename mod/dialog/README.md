Dialog
=================

###简介

额~， 你懂的


###使用
```js
var dialog = new Dialog({
  autoOpen: true
});
```


###参数
* title         设置dialog的title内容
* dom           设置dialog中显示的内容为某一个元素

```js
var dialog = new Dialog({
  dom: '#id'  //or $('#id')
});
```

* content       设置dialog中显示的为一个字符串，该字符串可为一段html代码
* url           从url请求中响应内容座位dialog中显示的内容
* esc           是否开启按下ESC，关闭窗口
* mask          是否遮罩
* autoOpen      是否初始化开启
* handle        触发dialog打开事件的元素
* buttons       按钮列表
```js
var dialog = new Dialog({
  buttons: {
    //上下文对象指向Dialog对象
    //参数传递self为按钮本身，如可利用他设置按钮被按下时的class
    //如果value是一个回调函数，则回调函数的对应事件为click
    'ok': function(self){
      this.close();
      console.log($(self).text());  //ok
    },

    'cancel': {
      classname: 'cancel_button',
      events: {
        click: function(){
          this.close();
        },
        
        mouseover: function(self){
          $(self).removeClass().addClass();
        }
      }
    }
  }
});
```

* firstOpen      第一次打开时的回调函数
* open           每次打开时的回调函数
* close          每次关闭时的回调函数

###API
* setTitle   设置dialog的title内容
* reset     重新设置dialog的位置
* open      打开dialog
* close     关闭dialog
* destory   销毁对象
* disabledButton 设置某一按钮不可用
```js
dialog.disabledButton(1); //设置第2个按钮不可用
```
* enabledButton 设置某一按钮可用
