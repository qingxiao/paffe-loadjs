module.exports = {
	number: {
		format: function(num){
			if(!num) return 0;

			return String(num).split('').reverse().join('').replace(/\d{3}/g, '$&,').split('').reverse().join('').replace(/^,/, '');
		}
	}
};