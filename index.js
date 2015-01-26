var c = require('cheerio');
var r = require('request');
var p = require('path');
var u = require('url');

var url = process.argv[process.argv.length - 1];

var url_array = [];

var map = function(loc) {

	//taking out GET arguments
	var loc_no_arg = loc.split('?')[0];
	var terminal_file = true;
	console.log(loc_no_arg);
	var path_array = loc_no_arg.split('/');
	var ext_test_in = path_array[path_array.length - 1];
	var ext_test = p.extname(ext_test_in);
	if((ext_test == "") && (path_array.length != 1)) {
		terminal_file = false;
	}
	
	
	r('http://'+loc_no_arg, function(err, resp, body) {
		if (err) {
			console.log("down");
			throw err;
		}
		var $ = c.load(body);
		$('a').each(function(i,ele) {
			var target_loc = $(this).attr('href');
			//insert data organization code here
			console.log(target_loc);
			var not_duplicate = true;
			var next_loc;
			var next_loc_obj = u.parse(target_loc, false, true);
			if(next_loc_obj.hostname == null) {
			console.log(next_loc_obj.hostname);
				next_loc = u.resolve(loc_no_arg, target_loc);
			} else {
				not_duplicate = false;
			}
			for(var i=0;i<url_array.length;i++) {
				if(url_array[i]==next_loc) {
					not_duplicate = false;
				}
			}
			if(not_duplicate) {
				map(next_loc);
			}
		});
	});
};
map(url);
//after map() done, fire event to start data realization on SVG.