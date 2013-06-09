var YQL = require("yql");

new YQL.exec('select * from html where url="http://datamart.talgov.com/pls/dmart/dm_www_user.consumption_form.display_results?prem_id_str=6388072015&svc_type_str=E" and xpath="//table//table[1]/tr"', function(response) {

console.log(response.query.results.tr);
for (var i = 0; i < response.query.results.tr.length; i++) {
	console.log(response.query.results.tr[i].td);
};
});
