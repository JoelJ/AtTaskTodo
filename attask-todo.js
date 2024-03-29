#!/usr/local/bin/node

var request = require('request');

var username = process.argv[2];
var password = process.argv[3];
var todos = process.argv.slice(4);

if(todos.length <= 0) {
	process.exit()
}

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

		console.log('logged in as', username, 'with session ID', sessionID);

		todos.forEach(function(todo) {
			todo = eval('('+todo+')');
			todo.sessionID = sessionID;
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
					console.log("created task", body.data.ID);
				} else {
					console.error(response);
				}
			});
		});
	} else {
		console.error(response);
	}
});