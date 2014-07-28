var Dialog = require('dialog');

return {
	/**
	 * 同浏览器默认的confirm 
	 * content：显示内容
	 * callback：确认后执行的函数
	 * unclose：点击确认后不关闭
	 * 
	 * 当unclose为true时 可手动执行close或者destory方法关闭弹窗
	 */
	confirm: function(content, callback, unclose){
		return new Dialog({
			title: '提示',
			width: 500,
			content: '<p class="ui-alert"><span>' + content + '</span></p>',
			autoOpen: true,
			buttons: {
				'确定': function(){
					callback();
					!unclose && this.destory();
				},

				'取消': function(){
					this.destory();
				}
			}
		});
	}
};