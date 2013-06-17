function b(){
    var fs = require('fs');
    var YQL = require('yql');
    var querystring = require('querystring');
    var file = fs.readFileSync("4_Parcels.geojson");
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
                                var fs = require('fs');
                                var outputFilename = '4_Parcels_premiseId.geojson';
                                data[index].premise_id_str = prem_id_str;
                                fs.appendFileSync(outputFilename, JSON.stringify(data[index], null, 4)+ ",");

                                
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
