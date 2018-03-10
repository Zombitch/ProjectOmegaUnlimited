var MongoClient = require("mongodb").MongoClient;

MongoManager = {
  database: null,

  // Connect to the database returning a promise
  connect : function(server, databaseName) {
    var self = this;
    return new Promise((resolve) => {
      MongoClient.connect("mongodb://" + server + "/" + databaseName, function(error, db) {
          if (error){
            resolve(false);
            console.log(error);
          }else{
            self.database = db;
            resolve(true);
            console.log("Connecté à la base de données '" + databaseName + "'");
          }
      });
    });
  },

  disconnect : function(){
    this.database.close();
  },

  getDatabase : function(){
    return this.database;
  },

  // Get count data from database
  count : function(table, filter){
    return new Promise((resolve, reject) => {
      this.database.collection(table).find(filter).count(function(err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Get data from database
  select : function(table, selectionFields, filter){
    return new Promise((resolve, reject) => {
      this.database.collection(table).find(filter, selectionFields).toArray(function(err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  selectWithOrderBy : function(table, selectionFields, filter, orderBy){
    return new Promise((resolve, reject) => {
      this.database.collection(table).find(filter, selectionFields).sort(orderBy).toArray(function(err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  selectWithOrderByAndLimit : function(table, selectionFields, filter, orderBy, limitNumber){
    return new Promise((resolve, reject) => {
      this.database.collection(table).find(filter, selectionFields).sort(orderBy).limit(limitNumber).toArray(function(err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  selectWithOrderByAndLimitWithSkip : function(table, selectionFields, filter, orderBy, limitNumber, skipNumber){
    return new Promise((resolve, reject) => {
      this.database.collection(table).find(filter, selectionFields).sort(orderBy).limit(limitNumber).skip(skipNumber).toArray(function(err, result) {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Insert data into database
  insert : function(table, data){
    return new Promise((resolve, reject) => {
      this.database.collection(table).insert(data, null, function (error, result) {
          if (error){
            console.log("ERROR : Insert data :" + error);
            reject(error);
          }
          else resolve(result);
      });
    });
  },

  //Update data into DB
  updateOnId : function(table, data, id){
    return new Promise((resolve, reject) => {
      this.database.collection(table).update({"_id":id}, {$set: data}, function(error, result){
        if (error) reject(error);
        else resolve(result);
      });
    });
  },

  //Update data into DB using custom filter
  updateOnFilter : function(table, data, filter){
    return new Promise((resolve, reject) => {
      this.database.collection(table).update(filter, {$set: data}, function(error, results){
        if (error) reject(error);
        else resolve(results);
      });
    });
  },

  // Insert data or update if the data already exists
  upsert : function (table, data, filter){
    var self = this;
    return new Promise((resolve, reject) => {
      self.select(table, {}, filter).then(function(results){
        if(results.length > 0){
          self.updateOnFilter(table, data, filter).then(function(err, res){
            resolve(true);
          });
        }else {
          self.insert(table, data).then(function(err, res){
            resolve(true);
          });
        }
      });
    });
  },

  //Remove entry
  remove : function(table, id){
    return new Promise((resolve, reject) => {
      this.database.collection(table).remove({"_id":id}, function(error, results){
        if (error) reject(error);
        else resolve(results);
      });
    });
  },

  //Remove entry using filter
  removeOnFilter : function(table, filter){
    return new Promise((resolve, reject) => {
      this.database.collection(table).remove(filter, function(error, results){
        if (error) reject(error);
        else resolve(results);
      });
    });
  },

  drop : function(table){
    return new Promise((resolve, reject) => {
      this.database.collection(table).remove({}, function(error, results){
        if (error) reject(error);
        else resolve(results);
      });
    });
  }
};

module.exports = MongoManager;
