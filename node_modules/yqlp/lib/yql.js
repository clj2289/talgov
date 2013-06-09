/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2012, Michael McHugh <developer@yrucalling.me>
All rights reserved.

*/

// Include required modules
var request = require('request'),
    url     = require('url'),
    q       = require('q'),
    YQL     = exports;

YQL.exec = function(/* yqlQuery, [params , httpOpts], callback */) {

    //Pull out the arguments, with defaults for optionals
    var args      = Array.prototype.slice.call(arguments),
      callback  = args.pop(),
      yqlQuery  = args.shift(),
      params    = args.shift()||{},
      httpOpts  = args.shift()|| { ssl: false };

    if (!yqlQuery) { 
        throw new Error("YQL.exec() missing YQL statement");
    }
    
    if (!callback) {
        // Seriously, you should be using a callback, at least for error checking
        throw new Error("YQL.exec() missing mandatory callback function");
    }

    var host = 'query.yahooapis.com',
        path = '/v1/public/yql',
        queryString = '',
        ssl = httpOpts.ssl;

    // Required YQL paramaters
    params.env    = params.env !== undefined ? params.env : 'http://datatables.org/alltables.env';
    params.format = params.format !== undefined ? params.format : 'json';
    params.q      = yqlQuery;

    // Construct the querystring
    for (var key in params) {
        queryString += key + '=' + encodeURIComponent(params[key]) + '&';
    }

    // Delete httpOpts.ssl as we already reassigned it and don't want stray HTTP headers
    delete httpOpts.ssl;

    // Execute the YQL request and fire the callback
    request({
            headers: httpOpts,
            json:    true,
            method:  'GET',
            url:     url.parse((ssl == true ? 'https': 'http') + '://' + host + path + '?' + queryString)
        }, function(error, response, body) {
            if (!error) {
                //YQL itself could still throw an error, so we better test for it...
                if (body.error) {
                    callback(body.error);
                    //But remember, some yql tables like weather will return a success
                    //response but report the error as part of the title or something.
                } else {
                    callback(null, body);
                }
            }
            else {
                //This error occurs when a lower level (transport) request fails
                callback(error);
            }
        }
    );
};

YQL.execp = function(/* yqlQuery, [params , httpOpts] */) {
    //Pull out the arguments, with defaults for optionals
    var args      = Array.prototype.slice.call(arguments),
      yqlQuery  = args.shift(),
      params    = args.shift()||{},
      httpOpts  = args.shift()|| { ssl: false };
      
    var deferred = q.defer();
    YQL.exec(yqlQuery, params, httpOpts, function(error, response) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(response);
        }
    });
    return deferred.promise;
    
}