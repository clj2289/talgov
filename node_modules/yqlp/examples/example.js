/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2012, Michael McHugh <developer@yrucalling.me>
All rights reserved.

*/

var YQL = require('../lib/yql');
var util = require('util');

//Example #1 - Parameter Binding using callback
YQL.exec("SELECT * FROM weather.forecast WHERE woeid=@woeid AND u='c'", { woeid:28341390 }, function(error, response) {
    if (error) {
        console.log('Ut oh! Example #1 has messed up:', error);
    } else {
        var results = response.query.results;
        var output = util.format('Example #1, The current weather in %s, %s is %s%s and %s',
            results.channel.location.city,
            results.channel.location.country,
            results.channel.item.condition.temp,
            results.channel.units.temperature,
            results.channel.item.condition.text
        );
        console.log(output);
    }
});

// Example #2 - Parameter binding + SSL
YQL.exec("SELECT * FROM weather.forecast WHERE woeid=@woeid AND u='c'", { woeid:1105779 }, { ssl: true }, function(error, response) {
    if (error) {
        console.log('Ut oh! Example #2 has messed up:', error);
    } else {
        var results = response.query.results;
        var output = util.format('Example #2, The current weather in %s, %s is %s%s and %s',
            results.channel.location.city,
            results.channel.location.country,
            results.channel.item.condition.temp,
            results.channel.units.temperature,
            results.channel.item.condition.text
        );
        console.log(output);
    }
});

//Example #3 - Parameter Binding using promise
YQL.execp("SELECT * FROM weather.forecast WHERE woeid=@woeid AND u='c'", { woeid:2348079 })
.then(function(response) {
    var results = response.query.results;
    var output = util.format('Example #3, The current weather in %s, %s is %s%s and %s',
        results.channel.location.city,
        results.channel.location.country,
        results.channel.item.condition.temp,
        results.channel.units.temperature,
        results.channel.item.condition.text
    );
    console.log(output);
}, function(error) {
    console.log('Ut oh! Example #3 has messed up:', error);
});



// Example #4 - Parameter binding + SSL with promise
YQL.execp("SELECT * FROM weather.forecast WHERE woeid=@woeid AND u='c'", { woeid:56504010 }, { ssl: true })
.then(function(response) {
    var results = response.query.results;
    var output = util.format('Example #4, The current weather in %s, %s is %s%s and %s',
        results.channel.location.city,
        results.channel.location.country,
        results.channel.item.condition.temp,
        results.channel.units.temperature,
        results.channel.item.condition.text
    );
    console.log(output);
}, function(error) {
    console.log('Ut oh! Example #4 has messed up:', error);
});

