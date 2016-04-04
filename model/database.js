// Follows the example of:
// https://www.terlici.com/2015/04/03/mongodb-node-express.html
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var ObjectId = mongo.ObjectId;

var state = {
    db: false
}

exports.connect = function(url,done){
    if (state.db) return done()
    
    MongoClient.connect(url, function(err, db) {
        if (err) return done(err);
        state.db = db;
        done();
    });
}
  
exports.get = function() {
  return state.db
} 

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}