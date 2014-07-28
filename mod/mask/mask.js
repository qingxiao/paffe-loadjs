var $ = require('jquery'), doc = document, body = doc.body;

function Mask(opt){
	this.options = $.extend({
		autoOpen: true
	}, opt || {});

	this.init();
}

Mask.prototype = {
	init: function(){
		var self = this;

		self.mask = $('<div class="ui-mask">').hide().appendTo(body);

		self.options.autoOpen && this.open();

		$(window).resize(function(){
			self.reset();
		});
	},

	open: function(){
		this.reset();
		this.mask.show();
	},

	close: function(){
		this.mask.hide();
	},

	reset: function(){
		this.mask.css({
			width: body.scrollWidth || doc.documentElement.scrollWidth,
			height: body.scrollHeight || doc.documentElement.scrollHeight
		});
	},

	destory: function(){
		this.mask.remove();
	}
};

return Mask;