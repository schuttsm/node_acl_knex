'use strict';

var knex = require('knex');
var KnexBackend = require('../');
var tests = require('../node_modules/acl/test/tests');

function run() {
	Object.keys(tests).forEach(function (test) {
		tests[test]();
	});
}

describe('Postgres', function () {
	before(function (done) {
		var self = this;
		
		new KnexBackend().setup(['travis_ci_test', 'postgres'], function(err, db) {
			if (err) return done(err);
			self.backend = new KnexBackend(db, 'postgres', 'acl_');
			done();
		});
	});
	
	run();
});

// Mysql and SQLite support coming soon.

// describe('MySql', function () {
// 	before(function (done) {
// 		var self = this;
// 		var db = knex({
// 			client: 'mysql',
// 			connection: {
// 				host: '127.0.0.1',
// 				port: 3306,
// 				user: 'root',
// 				password: ''
// 				database: 'travis_ci_test'
// 			}
// 		});
		
// 		var downSql = 'DROP TABLE IF EXISTS acl_meta, acl_resources, acl_parents, acl_users, acl_permissions';
		
// 		db.raw(downSql)
// 			.then(function() {
// 				self.backend = new KnexBackend(db, 'mysql', 'acl_');
// 				done();
// 			})
// 		;
		
// 	});
	
// 	run();
// });

// describe('SQLite', function () {
// 	before(function (done) {
// 		var self = this;
// 		var db = knex({
// 			client: 'sqlite',
// 			connection: {
// 				filename: './travis_ci_test.sqlite'
// 			}
// 		});
		
// 	});
	
// 	run();
// });