define('template', function(require, exports, module){

module.exports = {
	fetch: function(id, data){
		return this.parse(document.getElementById(id).innerHTML, data);
	},

	parse: function(content, data){
		try{
			return (new Function('d', 'r', 'c', "with(d){r.push('" 
				+ 
				content.replace(/(')|([\r\n]+)|<%(=?)(.*?)%>/g, function(_0, _1, _2, _3, _4){
					return _1 ? "\\'" : _2 ? "" : _3 ? "' + (" + _4 + ") + '" : "'); " + _4 + " r.push('";
				}) 
				+ 
				"');}return r.join('');"))(data, []);
		}catch(e){
			console && console.log(content);
			throw new Error(content);
		}
	}
};
});