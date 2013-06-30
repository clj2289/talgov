var fs = require('fs');
var YQL = require('yql');
var querystring = require('querystring');
var file = fs.readFileSync("eletricUsage.json");
file = file.toString().replace(/\,$/, '');
file = "[" + file + "]";
var data = JSON.parse(file);
var columns = ['premise_id_str', 'zip', 'address', 'taxId', 'month']
for (var i = 0; i < data.length; i++) {
	for (var k in data[i]){
		var vals = data[i][k];
		var key = k;
		//console.log(key);
		if(key == 'eletricUsage'){
			for (var ii =0; ii<vals.length; ii++){
				//console.log(vals[ii]);
				for (var kk in vals[ii]){ 
					console.log(vals[ii][kk]);
					console.log(kk);
				}
			}
		}
	};
};
