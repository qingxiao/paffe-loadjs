var $ = require('jquery'), Mask = require('mask'), Dialog = require('dialog');

function Tips(opt){
	this.options = $.extend({
		content: '',
		timeout: 3000,
		mask: false
	}, opt || {});

	this.init();
}

Tips.prototype = {
	init: function(){
		var self = this, opt = self.options;

		Tips.destory(); Tips.instance = self;

		self.$ = new Dialog({
			autoOpen: true,
			mask: opt.mask,
			title: false,
			width: false,
			content: opt.content
		});

		self.$.container.addClass('ui-tips');

		if(typeof opt.timeout == 'number'){
			self.id = setTimeout(function(){
				self.destory();
			}, opt.timeout);	
		}
	},

	destory: function(){
		this.$.destory();
		clearTimeout(this.id);
	}
};

Tips.instance = null;

Tips.destory = function(){
	if(Tips.instance){
		Tips.instance.destory();
	}
};

Tips.show = function(content, timeout, mask, classname){
	var tips = new Tips({
		content: content,
		timeout: timeout,
		mask: mask
	});

	if(classname) tips.$.container.find('.ui-dialog-content').addClass(classname);

	return tips;
};

$.each(['success', 'error', 'warn', 'loading'], function(index, item){
	Tips[item] = function(content, timeout, mask){
		return Tips.show(content, timeout, mask, 'ui-tips-' + item);
	};
});

return window.Tips = Tips;