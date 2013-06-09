var parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=ADDR1+%3D+%272115+FERNLEIGH+DR%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
    //parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=OWNER1+like+%27%25JUDD%25%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson"; 
    parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=OWNER1+like+%27%25JUDD+CH%25%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
	//parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=OWNER1+like+%27%25POPE+R%25%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
    parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=TAXID+%3D+%27110250+CM0020%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
 	//parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=TAXID+%3D+%27110250+AB0020%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
    //parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=1%3D1&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=json";

    var Client = require('node-rest-client').Client;

client = new Client();

// direct way
client.get(parcels, function(data, response){
            // parsed response body as js object
             var obj = JSON.parse(data);
            //console.log(obj);
            for (var i = 0; i < obj.features.length; i++) {
            	

var YQL = require("yql");
var address = encodeURIComponent(obj.features[i].attributes.ADDR1);
var querystring = require("querystring");
var prem_id_str = null;
console.log('http://datamart.talgov.com/pls/dmart/account_search.matching_premises?zip_5_str='+obj.features[i].attributes.ZIP1+'&street_name_str='+address+'&button_sw=Lookup%20Account');
new YQL.exec('select * from html where url="http://datamart.talgov.com/pls/dmart/account_search.matching_premises?zip_5_str='+obj.features[i].attributes.ZIP1+'&street_name_str='+address+'&button_sw=Lookup%20Account" and xpath="//table"', function(response) {

var p = response.query.results.table[1].tr[1].td[0].a.href;
console.log(p.indexOf("?"));
p = p.substring(p.indexOf("?")+1,p.length);
console.log(p);
var x = querystring.parse(p)
prem_id_str = x.premise_id_str;
console.log(prem_id_str);
//console.log(querystring.parse(p));

//for (var i = 0; i < response.query.results.length; i++) {
//	console.log(response.query.results[i]);
//}

new YQL.exec('select * from html where url="http://datamart.talgov.com/pls/dmart/dm_www_user.consumption_form.display_results?prem_id_str='+prem_id_str+'&svc_type_str=E" and xpath="//table//table[1]/tr"', function(response) {

//console.log(response.query.results.tr);
for (var i = 0; i < response.query.results.tr.length; i++) {
	try{
	console.log(response.query.results.tr[i].td[0].p);
	console.log(response.query.results.tr[i].td[3].p);
	} catch (err){
	}
};
});



});



            };
            
        });




