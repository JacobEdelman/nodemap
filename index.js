var c = require('cheerio');
var r = require('request');

var url = 'http://' + process.argv[process.argv.length - 1];

var url_array = [];

var map = function(loc) {
	var loc_no_arg = loc.split('?')[0];
	var terminal_file = false;
	console.log(loc);
	if(loc_no_arg.slice(-1)!='/') {
		console.log("aa");
		var loc_no_proto = loc_no_arg.substring(7);
		var path_array = loc_no_proto.split('/');
		if((path_array[path_array.length - 1].indexOf('.') === -1)||(path_array.length == 1)) {
			loc_no_arg += '/';
			console.log("aaa");
		} else {
			terminal_file = true;
			console.log("aaaa");
		}
	}
	url_array[url_array.length] = loc_no_arg;
	r(loc_no_arg, function(err, resp, body) {
		if (err) {
			console.log("aaaaa");
			throw err;
		}
		var $ = c.load(body);
		$('a').each(function(i,ele) {
			
			//insert data organization code here
			console.log($(this).attr('href'));
			
			
			var next_loc = loc_no_arg + $(this).attr('href');
			var not_duplicate = true;
			for(var i=0;i<url_array.length;i++) {
				if(url_array[i]==next_loc) {
					not_duplicate = false;
					console.log("b");
				}
			}
			if(not_duplicate) {
				map(next_loc);
				console.log(next_loc);
			}
		});
	});
};
map(url);
//after map() done, fire event to start data realization on SVG.