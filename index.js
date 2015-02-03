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

var map = function(loc,depth) {
	if(depth == undefined) depth = 0;
	if(depth > 5) return;
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
			target_loc = $(this).attr('href');
			if (target_loc == undefined) return;
			console.log(target_loc)
			if(target_loc.indexOf(".") == -1 )return;
				not_duplicate = true;
				next_loc_obj = u.parse(target_loc, false, true);
					if(next_loc_obj.hostname == null) {
						next_loc = u.resolve(loc_no_arg, target_loc);
					} else {
						not_duplicate = false;
					}
					for(var i=0; i<url_array.length; i++) {
						if(url_array[i]==next_loc) {
							not_duplicate = false;
						}
					}
					if (err) throw err;
					if(not_duplicate) {
						url_array.push(next_loc);
						map(next_loc,depth+1)
					}
		});
	});
};
map(url);
//after map() done, fire event to start data realization on SVG.
