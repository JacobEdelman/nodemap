var c = require('cheerio');
var r = require('request');
var p = require('path');
var u = require('url');
var f = require('flow');

var url = process.argv[process.argv.length - 1];

if(url.slice(-1) != '/') {
	url += '/';
}

var url_array = [];

var map = function(loc) {

	//taking out GET arguments
	var loc_no_arg = loc.split('?')[0];
	
	r(loc_no_arg, function(err, resp, body) {
		if (err) {
			console.log("down");
			throw err;
		}
		var $ = c.load(body);
		$('a').each(function(i,ele) {
			var target_loc;
			var not_duplicate;
			var next_loc;
			var next_loc_obj;
			f.exec(
				function() { target_loc = $(this).attr('href'); },
				function(err) { if (err) throw err; console.log(target_loc); console.log("aasdasddddddd"); },
				function(err) { if (err) throw err; console.log("asd"); not_duplicate = true; },
				function(err) { if (err) throw err; next_loc_obj = u.parse(target_loc, false, true); },
				function(err) {
					if (err) throw err;
					if(next_loc_obj.hostname == null) {
						next_loc = u.resolve(loc_no_arg, target_loc);
						console.log("asdsad"+loc_no_arg+"asd");
					} else {
						not_duplicate = false;
					}
				},
				function(err) {
					if (err) throw err;
					for(var i=0; i<url_array.length; i++) {
						if(url_array[i]==next_loc) {
							not_duplicate = false;
						}
					}
				},
				function(err) {
					if (err) throw err;
					if(not_duplicate) {
						url_array[url_array.length] = next_loc;
					}
				}
			);
		});
	});
};
map(url);
//after map() done, fire event to start data realization on SVG.