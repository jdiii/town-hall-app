module.exports = function(col) {

    var db = require('../model/database');

    var voteLimit = require('../config/config').settings.voteLimit;
    console.log(voteLimit);

    var posts = {};

    posts.submit = function(text,user,anonymous,done){
        this.db = db;
        var likers = [user];

        db.get().collection(col).count(function(err,count){
            if(err) { console.log(err) }

            var doc = { "text":text, "submittedBy":user, "likers":likers, "status":"open", "isAnon":anonymous, "upvoteId": count+1 };

            db.get().collection(col).insert(doc,function(err,result){
                if(err) console.log(err);
                done(newPost(doc));
            });


        });
    };

    posts.upvote = function(name,id,done){

        db.get().collection(col).findOne({"upvoteId" : Number.parseInt(id)},function(err,item){
            console.log(item);
            if (err){
                console.log(err);
                console.log('returning null due to findOne error');
                done(null);
            }
            if(item){
                if(item.likers.indexOf(name) == -1 || item.name == 'John Davey' || item.name == 'john davey'){

                    if(voteLimit == 0){
                        posts.commitUpvote(item,name,function(data){
                            done(data);
                        });
                    } else if(voteLimit > 0){
                        posts.getUserVoteCount(name,function(voteCount){
                            if(voteLimit > voteCount){
                                posts.commitUpvote(item,name,function(data){
                                    done(data);
                                });
                            } else {
                                done({error: 'exceeded vote limit'});
                            }
                        });
                    } else {
                        done({error: 'upvoteLimit invalid. Check your config/config.js file.'});
                    }
                } else {
                    done({error:'already upvoted'});
                }
            } else {
                done({error:'unknown error'});
            }
        });

    };

    posts.getUserVoteCount = function(name,done){
        this.getAll(function(data){
            if(data){
                var voteCount = 0;
                console.log(data);
                for(var i = 0; i < data.length; i++){
                    if(data[i].likers.indexOf(name) > -1 && data[i].displayName != name){
                        voteCount++;
                    }
                }
                console.log('user vote count is ' + voteCount);
                done(voteCount);
            } else {
                done({error: 'database error :('});
            }
        });
    };

    posts.commitUpvote = function(item,name,done){

        item.likers.push(name);
        db.get().collection(col).update({_id:item._id},{$set: {likers: item.likers}},function(err,result){
            console.log(result);
            if(err) console.log(err);
            var data = {error:null,"likers": item.likers,"upvoteId":item.upvoteId};
            done(data);
        });

    };

    posts.markAnswered =  function(id,done){
        db.get().collection(col).update({"upvoteId" : Number.parseInt(id)}, { $set : { status : 'answered' }},function(err,result){
            console.log(result);
            if(err) console.log(err);
            done({"upvoteId":id});
        });
    };

    posts.markDeleted =  function(id,done){
        db.get().collection(col).update({"upvoteId" : Number.parseInt(id)}, { $set : { status : 'deleted ' }},function(err,result){
            console.log(result);
            if(err) console.log(err);
            done({"upvoteId":id});
        });
    };

    posts.getAll = function(done){
        console.log(db.get());
        console.log(col);
        db.get().collection(col).find({ 'status' : 'open' },{"_id":1,'text':1,'likers':1,'submittedBy':1,'isAnon':1,'upvoteId':1}).toArray(function(err,docs){
            if(err) console.log(err);

            var data = new Array();
            if(docs){
                for(var i = 0; i < docs.length; i++){
                    data.push(newPost(docs[i]));
                }
                done(data);
            } else{
                console.log('no data to return');
                done(null);
            }
        });
    };

    var objectIdToString = function(objectId){
        return objectId.str;
    };

    var newPost = function(doc){
        var name;
        if (doc.isAnon) {
            name = 'Anonymous';
        } else {
            name = doc.submittedBy;
        }

        return {"displayName":name,"text":doc.text,"likers":doc.likers,"upvoteId":doc.upvoteId,"id":doc._id.str};
    };

    return posts;

}
