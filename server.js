#!/usr/bin/env node

var express = require('express');
var app = express();
var cons = require('consolidate');


var env = process.env;
var config =  {
  tasksUrl: env.TASKS_URL || "",
  jenkinsUrl: env.JENKINS_URL || "",
  jenkinsWebSocket: {
    href: env.JENKINS_WS_HREF || "",
    protocol: env.JENKINS_WS_PROTOCOL || ""
  },
  port: env.SERVER_PORT || ""
};

app.configure(function() {
  app.use(express.compress());

  app.engine('html', cons.mustache);
  app.set('view engine', 'html');

});

app.configure('production', function() {
  app.use(express.errorHandler());
  app.set('views', __dirname + '/target/frontend-build/views');
  app.use(express.static(__dirname + '/target/frontend-build/static'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  app.set('views', __dirname + '/src/views');
  app.use(express.static(__dirname + '/src/static'));
});

app.all('*', function(request, response) {
  response.render('index', {config: JSON.stringify(config)});
});

var port = config.port || 8000;
app.listen(port);

console.log("started server on " + port);