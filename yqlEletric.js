function a() {

    var parcels = null;
    //parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=ADDR1+%3D+%272115+FERNLEIGH+DR%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
    //parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=OWNER1+like+%27%25JUDD%25%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson"; 
    //parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=OWNER1+like+%27%25JUDD+CH%25%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
    //parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=OWNER1+like+%27%25POPE+R%25%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
    //parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=TAXID+%3D+%27110250+CM0020%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
    //parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=TAXID+%3D+%27110250+AB0020%27&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=pjson";
    parcels = "http://tlcinter.leoncountyfl.gov/TLCAGS/rest/services/MapServices/TLC_PropertyInfo/MapServer/1/query?text=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&objectIds=&where=1%3D1&time=&returnCountOnly=false&returnIdsOnly=false&returnGeometry=true&maxAllowableOffset=&outSR=&outFields=*&f=json";
    var Client = require('node-rest-client').Client;
    client = new Client();
    var sys = require('util'),
    rest = require('restler');
    var addressData = [];
    rest.get(parcels).on('complete', function(data) {

        var obj = JSON.parse(data);
        for (var i = 0; i < obj.features.length; i++) {
            var address = encodeURIComponent(obj.features[i].attributes.ADDR1);
            var zip = encodeURIComponent(obj.features[i].attributes.ZIP1);
            var taxId = encodeURIComponent(obj.features[i].attributes.TAXID);
            var d = {
                    address:address,
                    zip:zip,
                    taxId:taxId
            };
            //console.log(d);
            addressData.push(d);
            //console.log(addressData);
        }
        var fs = require('fs');

        var outputFilename = 'my.json';

        fs.writeFileSync(outputFilename, JSON.stringify(addressData, null, 4));
    });

    //console.log(addressData);
    //return addressData;

}

function b(){
    var fs = require('fs');
    var YQL = require('yql');
    var querystring = require('querystring');
    var file = fs.readFileSync("my.json");
    var data = JSON.parse(file);
    console.log("done reading file");
    var funcs = [];
    var prems = [];
    for (var i = 0; i <data.length; i++) {
        funcs[i] = (function(index) { 
            var zip = data[index].zip;
            var address = data[index].address;
            var taxId = data[index].taxId;
            return function(){
             var  prem = new YQL.exec('select * from html where url="http://datamart.talgov.com/pls/dmart/account_search.matching_premises?zip_5_str=' + zip + '&street_name_str=' + address + '&button_sw=Lookup%20Account" and xpath="//table"', function (r) {
                            try{
                                var p = r.query.results.table[1].tr[1].td[0].a.href;
                                p = p.substring(p.indexOf("?") + 1, p.length);
                                var x = querystring.parse(p)
                                prem_id_str = x.premise_id_str;
                                
                                var o = {premise_id_str:prem_id_str, zip:zip, address:address, taxId:taxId};
                                console.log(o);
                                var fs = require('fs');
                                var outputFilename = 'addr.json';
                                fs.appendFileSync(outputFilename, JSON.stringify(o, null, 4)+ ",");

                                
                            } catch (e){
                                console.log(e);

                            }
                        });
             
            }
        })(i);

    };
    var premsData  = [];
    for (var j = 0; j < data.length; j++) {
        funcs[j]();           
    }
}



function c(){
    var fs = require('fs');
    
    var querystring = require('querystring');
    var file = fs.readFileSync("addr.json");
    
    var data = JSON.parse("["+file+"]");
    var funcs = [];
    for (var i = 0; i < data.length; i++) {
        funcs[i] = (function(index) { 
            var prem_id_str = data[index].premise_id_str; 
            console.log(prem_id_str);
            var YQL = require('yql');
            var url = 'select * from html where url="http://datamart.talgov.com/pls/dmart/dm_www_user.consumption_form.display_results?prem_id_str=' + prem_id_str + '&svc_type_str=E" and xpath="//table//table[1]/tr"';
            return function(){
                var cv = new YQL.exec(url, function (response) {
                                console.log("jere");
                                console.log(response);
                                var eletricUsage = [];
                                for (var ii = 0; ii < response.query.results.tr.length; ii++) {
                                    try {
                                        var name = response.query.results.tr[ii].td[0].p;
                                        var val = response.query.results.tr[ii].td[3].p;
                                        var obj = {};
                                        obj[name] = val;
                                        console.log(obj);
                                        eletricUsage.push(obj);

                                        
                                    } catch (err) {
                                        console.log(err);
                                    }
                                };

                                data[index].eletricUsage = eletricUsage;
                                var fs = require('fs');
                                var outputFilename = 'eletricUsage.json';
                                fs.appendFileSync(outputFilename, JSON.stringify(data[index], null, 4)+ ",");

                });  
            } 
        })(i);
    };

    for (var j = 0; j < data.length; j++) {
        funcs[j]();           
    }

}


//a();
//b();
c();
