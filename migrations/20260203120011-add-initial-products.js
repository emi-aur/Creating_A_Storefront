'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  return Promise.all([
    db.insert('products', ['name', 'price'], ['Handy', 330]),
    db.insert('products', ['name', 'price'], ['Toaster', 40]),
    db.insert('products', ['name', 'price'], ['Waage', 30]),
    db.insert('products', ['name', 'price'], ['Schuh', 40])
  ]);
};

exports.down = function (db) {
  return db.runSql('TRUNCATE TABLE products RESTART IDENTITY;');
};

exports._meta = {
  "version": 1
};
