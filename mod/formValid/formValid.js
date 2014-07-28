define('jquery', function(require, exports, module){

var $ = require('jquery');

function FormValid(opt){
	this.options = $.extend({
		dom: null,
		rules: {}
	}, opt || {});

	this.init();
}

FormValid.prototype = {
		init: function(){
			this.dom = $(this.options.dom);
		},

		check: function(){
			this.reset();

			var $dom = this.dom;

			var t = this, status = true;

			$.each(this.options.rules, function(index, item){
				var $tmp = $dom.find('[name=' + index + ']'), value = $tmp.val(), tmpStatus = true;

				if( Object.prototype.toString.call(item) != '[object Array]' ){
					item = [item];
				}

				for( var i = 0; i < item.length; i++ ){
					var tmp = item[i];

					if( typeof tmp.rule == 'function' && !tmp.rule(value) ){
						status = false; tmpStatus = false;
					} else if ( tmp.rule.constructor == RegExp && !tmp.rule.test(value) ){
						status = false; tmpStatus = false;
					}

					if( !tmpStatus ){
						$tmp.parent().append('<span class="ui-formvalid-field-error">' + tmp.errorText + '</span>');
						return;
					}	
				} 
			});

			return status;
		},

		reset: function(){
			this.dom.find('.ui-formvalid-field-error').remove();
		},

		addRule: function( name, rule ){
			this.options.rules[name] = rule;
		}
};

return FormValid;

}, 'jquery');