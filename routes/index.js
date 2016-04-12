module.exports = function(io) {
    var config = require('../config/config');
    var templateVars = {'title' : config.settings.appTitle, 'logo' : config.settings.appLogo};
    var express = require('express');
    var router = express.Router();
    var bodyParser = require('body-parser');
    var db = require('../model/database');
    var posts = require('../model/posts')(config.database.dataCollection);
    var passportConfig = require('../auth/passport');
    var passport = require('passport');

    /* passport auth methods */
    router.get('/login',function(req,res,next){
        res.render('login',templateVars);
    });

    router.get('/auth/google', passport.authenticate('google',{'scope':['email','profile']}), function (req, res){
        //res.redirect("/");
    });

    router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
        res.redirect('/');
    });

    /* GET home page. */
    router.get('/', ensureAuthenticated, function(req, res, next) {
     	res.render('index', templateVars);
    });

    /* post a submission */
    router.post('/post',ensureAuthenticated,function(req,res){

        console.log(req.query.text);
        console.log(req.user);
        console.log(req.user.data.name);
        var submission = req.query.text.replace(/(<([^>]+)>)/ig,""); //strip html tags
        posts.submit(submission,req.user.data.name,false,function(result){
  		    io.emit('newPost',result);
  		    console.log('update emitted');
  		    res.status(200).send('QA post has been processed successfully.');
        });
    });

    /* post an upvote */
    router.post('/upvote',ensureAuthenticated,function(req,res){

        posts.upvote(req.user.data.name , req.query.id , function(result){
            console.log(result);
            if(result.error == null){
                io.emit('upvote',result);
    		        console.log('upvote emitted');
    		        res.status(200).send('Upvote processed.');
            } else if (result.error == 'already upvoted'){
                res.status(304).send('Error: You already voted for that.');
            } else if (result.error == 'exceeded vote limit'){
                res.status(305).send('Error: Upvote limit exceeded.');
            } else {
                res.status(306).send('Error');
            }
        })

    });

    /* get mod page. */
    router.get('/mod',ensureAuthenticated,function(req,res){

        if(config.settings.modSecret == '' || req.query.secret == config.settings.modSecret){
    	    res.render('mod', templateVars);
        } else {
            res.status(403).send('Unauthorized. You must append the correct modSecret as a query parameter.');
        }

    });

    router.post('/mod',function(req,res){
    	try{
    		console.log(req.query.id);

    		if(!isNaN(req.query.id)){

    		    //status --> complete if completed
    		    if(req.query.status == 'completed'){
    		        posts.markAnswered(req.query.id,function(result){
    			        console.log('setting as complete: '+result);
    			        io.emit('answered',result);
    			    });
    			    res.status(200).send('OK');
    		    } else if (req.query.status == 'deleted'){
    		        posts.markDeleted(req.query.id , function(result){
    			        console.log('setting as deleted: '+result);
    			        io.emit('answered',result);
    			    });
    			    res.status(200).send('OK');
    		    } else {
    		        res.status(200).send('POST received, but status not recognized.');
    		    }

    		} else {
    			res.status(400).send('Not found');
    		}
    	} catch(err){
    		res.status(500).send('Error: QA could not process your request');
    	}
    });

    io.on('connection', function (socket) {
        posts.getAll(function(data){
            socket.emit('initialize',data);
        });
        console.log('a user connected');
    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login');
    }

    return router;
}
