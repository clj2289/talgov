#!/bin/node
/*

Software Copyright License Agreement (BSD License)

Copyright (c) 2012, Michael McHugh <developer@yrucalling.me>
All rights reserved.

*/

var assert = require('assert'),
    yql    = require('../lib/yql');

// Example #1 - Param binding
new yql.exec("SELECT * FROM weather.forecast WHERE (location = @zip)", {"zip": 90066}, function(error, response) {
    assert.ifError(error);
    assert.ok(response, 'Test #1: Parameter binding with callback expected the "response" object to be set');
    assert.ok(response.query, 'Test #1: Parameter binding with callback expected the "reponse" object to have a "query" property');
    assert.ok(response.query.results, 'Test #1: Parameter binding with callback expected the "reponse" object "query" property to have a "results" property');
    console.log("Test #1: OK");
});


// Example #2 - Param binding + SSL
new yql.exec("SELECT * FROM html WHERE url = @url", {url:"http://www.yahoo.com"}, {ssl:true}, function(error, response) {
    assert.ifError(error);
    assert.ok(response, 'Test #2: Parameter binding + SSL with callback expected the "response" object to be set');
    assert.ok(response.query, 'Test #2: Parameter binding + SSL with callback expected the "reponse" object to have a "query" property');
    assert.ok(response.query.results, 'Test #2: Parameter binding + SSL with callback expected the "reponse" object "query" property to have a "results" property');
    console.log("Test #2: OK");
});


// Example #3 - Non-existent table
new yql.exec("SELECT * FROM foobar.badTable", function(error, response) {
    assert.ok(error, 'Test #3: Selecting from a non existent table with callback expected the "error" object to be set');
    console.log("Test #3: OK");
});


// Example #4 - Missing required fields
new yql.exec("SELECT * FROM html", function(error, response) {
    assert.ok(error, 'Test #4: Missing required fields with callback expected the "error" object to be set');
    console.log("Test #4: OK");
});

// Example #5 - Param binding as promise
(function() {
    yql.execp("SELECT * FROM weather.forecast WHERE (location = @zip)", {"zip": 90066})
    .then(function(response) { //success
        assert.ok(response, 'Test #5: Parameter binding with promise expected the Callback "response" object to be set');
        assert.ok(response.query, 'Test #5: Parameter binding with promise expected the Callback "reponse" object to have a "query" property');
        assert.ok(response.query.results, 'Test #5: Parameter binding with promise expected the Callback "reponse" object "query" property to have a "results" property');
        console.log("Test #5: OK");
    }, function(error) {
        assert.fail(error, null, "Test #5: Parameter binding with promise expected the Callback to execute, not the Errback");
    }).done();
})();

// Example #6 - Param binding + SSL as promise
(function() {
    yql.execp("SELECT * FROM html WHERE url = @url", {url:"http://www.yahoo.com"}, {ssl:true})
    .then(function(response) { //success
        assert.ok(response, 'Test #6: Parameter binding + SSL with promise expected the Callback "response" object to be set');
        assert.ok(response.query, 'Test #6: Parameter binding + SSL with promise expected the Callback "reponse" object to have a "query" property');
        assert.ok(response.query.results, 'Test #6: Parameter binding + SSL with promise expected the Callback "reponse" object "query" property to have a "results" property');
        console.log("Test #6: OK");
    }, function(error) {
        assert.fail(error, null, "Test #6: Parameter binding with promise expected the Callback to execute, not the Errback");
    }).done();
})();

// Example #7 - Non-existent table as promise
(function() {
    yql.execp("SELECT * FROM foobar.badTable")
    .then(function(response) { //success
        assert.fail(response, null, 'Test #7: Non existent table with promise expected the Errback to execute, not the Callback');
    }, function(error) {
        assert.ok(error, 'Test #7: Non exitent table with promise expected the Errback "error" object to be set');
        console.log("Test #7: OK");
    }).done();
})();

// Example #8 - Missing required fields
(function() {
    yql.execp("SELECT * FROM html")
    .then(function(response) { //success
        assert.fail(response, null, 'Test #8: Missing required fields with promise expected the Errback to execute, not the Callback');
    }, function(error) {
        assert.ok(error, 'Test #8: Non exitent table with promise expected the Errback "error" object to be set');
        console.log("Test #8: OK");
    }).done();
})();
