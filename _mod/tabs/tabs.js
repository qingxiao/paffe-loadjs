var $ = require('jquery');

var tabs = function(opt){
    this.options = $.extend({
        dom: null,
        attr: 'href',
        currentclass: '',
        currentindex: 0,
        callback: function(){}
    }, opt || {});

    this.init();
};

tabs.prototype = {
    init: function(){
        var self = this;
        this.doms = $(this.options.dom);
        this.targets = [];
        $.each(this.doms, function(index, item){
            var id = item[self.options.attr] || item.getAttribute(self.options.attr);
            var target;
            
            if( target = document.getElementById(id) ){
                self.targets.push(target);
            }
        });
        
        this.targets = $(this.targets);
        
        this.bind();
        
        this.tabTo(this.options.currentindex);
    },
    
    bind: function(){
        var self = this, cc = self.options.currentclass;
        $.each(this.doms, function(index, item){
            $(item).click(function(){
                self.targets.hide();
                if( self.targets[index] ) self.targets.eq(index).show();
                if(cc) {
                    self.doms.removeClass(cc);
                    $(this).addClass(cc);
                }
                if( self.options.callback ) self.options.callback.call(this);
                return false;
            });
        });
    },
    
    tabTo: function(index){
        index = index || 0;
        if( index > this.doms.length - 1 ) return false;
        
        this.doms.eq(index).click();
    }
};

return tabs;