var YQL = require("yql");

new YQL.exec('select * from html where url="http://datamart.talgov.com/pls/dmart/dm_www_user.consumption_form.display_results?prem_id_str=6388072015&svc_type_str=E" and xpath="//table//table[1]/tr"', function(response) {

//console.log(response.query.results.tr);
for (var i = 0; i < response.query.results.tr.length; i++) {
	//console.log(response.query.results.tr[i].td);
};
});
var util = require('util');


new YQL.exec('select * from html where url="http://datamart.talgov.com/pls/dmart/account_search.matching_premises?zip_5_str=32311&street_name_str=2115%20Fernleigh%20Dr&button_sw=Lookup%20Account" and xpath="//table[0]"', function(response) {

console.log(util.inspect(response.results));



});




