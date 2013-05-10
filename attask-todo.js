#!/usr/local/bin/node

var request = require('request');

var username = process.argv[2];
var password = process.argv[3];
var todos = process.argv.slice(4);

var loginOptions = {
	method: 'POST',
	qs: {
		username: username,
		password: password
	},
	json: true
};

request('https://hub.attask.com/attask/api-internal/login', loginOptions, function (error, response, body) {
	if (!error && response.statusCode == 200) {
		var sessionID = body.data.sessionID;
		var userID = body.data.userID;

		console.log('logged in as', username, 'with session ID', sessionID); //TODO: You are a monkey

		todos.forEach(function(todo) { //TODO: You are "weird"
			todo = eval('('+todo+')');
			todo.sessionID = sessionID;
			todo.name = todo.name.trim();
			if(todo.projectID === undefined) {
				todo.personal = true;
			}
			if(todo.assignedToID === undefined) {
				todo.assignedToID = userID;
			}

			var newTaskOptions = {
				method: 'POST',
				qs: todo,
				json: true
			};

			request('https://hub.attask.com/attask/api-internal/task', newTaskOptions, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log("created task", body.ID);
				} else {
					console.error(response);
				}
			});
		});
	} else {
		console.error(response);
	}
});