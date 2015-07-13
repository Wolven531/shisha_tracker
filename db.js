var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shisha_tracker'
});

module.exports.get = function(table, cb){
  var sql = 'SELECT * FROM ' + table + ' ORDER BY id;';
  connection.query(sql, function(err, rows, fields){
    if(err) {
      console.log('Error with all GET: ' + sql);
      console.log(err);
      cb({error: err});
    }
    else {
      cb(rows);
    }
  });
};

module.exports.getSingle = function(table, id, cb){
  var sql = 'SELECT * FROM ' + table + ' WHERE id = ' + id + ';';
  connection.query(sql, function(err, rows, fields){
    if(err) {
      console.log('Error with single GET: ' + sql);
      console.log(err);
      cb({error: err});
    }
    else {
      cb(rows);
    }
  });
};

module.exports.update = function(table, id, fields, vals, cb){
  var sql = 'UPDATE ' + table + ' SET ';
  if(!Array.isArray(fields)) {
    cb({error: 'Invalid DB fields for PUT request.'});
    return;
  }
  if(!Array.isArray(vals)) {
    cb({error: 'Invalid DB vals for PUT request.'});
    return;
  }
  if(fields.length !== vals.length) {
    cb({error: 'Non-matching number for DB fields and vals for PUT request.'})
    return;
  }
  for(var a = 0; a < fields.length; a++) {
    sql += (a > 0 ? ',' : '') + fields[a] + ' = ';
    if(!isNaN(vals[a])) {//check if this should be a number
      sql += vals[a];
    }
    else {
      sql += '"' + vals[a] + '"';
    }
  } 
  sql += ' WHERE id = ' + id + ';';
  connection.query(sql, function(err, rows, fields){
    if(err) {
      console.log('Error with PUT: ' + sql);
      console.log(err);
      cb({error: err});
    }
    else {
      cb({success: true});
    }
  });
};

module.exports.post = function(table, fields, vals, cb){
  var sql = 'INSERT INTO ' + table + ' (';
  if(!Array.isArray(fields)) {
    cb({error: 'Invalid DB fields for POST request.'});
    return;
  }
  if(!Array.isArray(vals)) {
    cb({error: 'Invalid DB vals for POST request.'});
    return;
  }
  for(var a = 0; a < fields.length; a++) {
    sql += (a > 0 ? ',' : '') + fields[a];
  }
  sql += ') VALUES (';
  for(var a = 0; a < vals.length; a++) {
    sql += a > 0 ? ',' : '';
    if(!isNaN(vals[a])) {// check if this should be a number
      sql += vals[a];
    }
    else {
      sql += '"' + vals[a] + '"';
    }
  }
  sql += ');';
  connection.query(sql, function(err, rows, fields){
    if(err) {
      console.log('Error with POST: ' + sql);
      console.log(err);
      cb({error: err});
    }
    else {
      cb({id: rows.insertId});
    }
  });
};
/**
var MongoClient = require('mongodb').MongoClient;
var host = 'mongodb://localhost:27017/';
var dbName = 'random';
module.exports.get = function(collName, cb){
  var collection;
  MongoClient.connect(host + dbName, function(err, db) {
    if(err) {
      console.log('ERROR in DB:');
      console.log(err);
    }
    else {
      console.log('Connected to mongo. Requesting: ' + collName);
      collection = db.collection(collName, function(err, coll){
        if(err){
          cb({'error':err});
        }
        else{
          cb(coll);
        }
      });
    }
  });
};

module.exports.put = function(collName, val, cb){
  var collection;
  MongoClient.connect(host + dbName, function(err, db) {
    if(err) {
      console.log('ERROR in DB:');
      console.log(err);
    }
    else {
      console.log('Connected to mongo. Putting in "' + collName + '" val: ' + val);
      collection = db.collection(collName);
      console.log(collection);
      collection.insert(val, {w: 1}, function(err, result){
        if(err){
          cb({'error':err});
        }
        else{
          cb(result);
        }
      });
    }
  });
};
**/