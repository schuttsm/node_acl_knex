'use strict';

var knex = require('knex');

var downSql = 'DROP TABLE IF EXISTS "{{prefix}}meta";'+
  'DROP TABLE IF EXISTS "{{prefix}}resources";'+
  'DROP TABLE IF EXISTS "{{prefix}}parents";'+
  'DROP TABLE IF EXISTS "{{prefix}}users";'+
  'DROP TABLE IF EXISTS "{{prefix}}permissions";';
var upSql = 'CREATE TABLE {{prefix}}meta (key TEXT NOT NULL PRIMARY KEY, value TEXT[][] NOT NULL);'+
  'CREATE TABLE {{prefix}}resources (key TEXT NOT NULL PRIMARY KEY, value TEXT[][] NOT NULL);'+
  'CREATE TABLE {{prefix}}parents (key TEXT NOT NULL PRIMARY KEY, value TEXT[][] NOT NULL);'+
  'CREATE TABLE {{prefix}}users (key TEXT NOT NULL PRIMARY KEY, value TEXT[][] NOT NULL);'+
  'CREATE TABLE {{prefix}}permissions (key TEXT NOT NULL PRIMARY KEY, value JSON NOT NULL);';

function tmpl(str, ctx) {
  var n = 1;
  var sql = str.replace(/{{(\w+)}}/g, function(match, cap1) {
    return ctx[cap1] || match;
  });
  return sql.replace(/\?/g, function() { return '$' + n++; });
}

function createTables(args, callback) {
  var db_name = args[0], username = args[1], password = args[2], prefix = args[3];
  if (!db_name) throw Error('no db_name (1st arg) supplied');
  if (!username) throw Error('no username (2nd arg) supplied');
  if (!prefix) prefix = 'acl_';
  var db = knex({
    client: 'postgres',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: username,
      database: db_name,
      password: password
    }
  });
  db.raw(tmpl(downSql+upSql, {'prefix': prefix})).then(function() {
    callback(null, db);
  });
}

exports.createTables = createTables;
