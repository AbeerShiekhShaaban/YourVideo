const exp = require('express');
const mongose = require('mongoose');
const models = require('./db');
const parseBody = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const auth = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const funcs = require('./middlewares');

const Video = models.Video;
const User = models.User;
const Comment = models.Comment;
const Reply = models.Reply;

const lookAt = funcs.lookFor;
const del = funcs.del;


mongose.connect('mongodb://127.0.0.1/vidDbB');
mongose.connection.once('open' , function(){console.log("DB is connected")})
       .on('error' , function(err){console.log("error:" , err)});

const app = exp();
app.use(parseBody.urlencoded({extended: false}));
app.use(parseBody.json());
app.use('/static', exp.static('public'));
app.use(cors({
    origin:'http://localhost:3000', 
    credentials: true
}));

app.use(auth({  // session need proxy in react package.json https://www.youtube.com/watch?v=nviGhgtFbRo
	secret: 'ab',
	resave: false,
	saveUninitialized: true,
    cookie: {
        secure: false,
        sameSite: 'lax'
    },
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://127.0.0.1/vidDB'
    })
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if(file.fieldname == 'f1'){
        cb(null , './public/userImg')
      }
      else if(file.fieldname == 'f2Thumb') {
        cb(null , './public/videoThumbnai')
      }
      else if(file.fieldname == 'f3Vid') {
        cb(null , './public/videoUploaded')
      } 
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

/**********************************************************************************/
/**********************************************************************************/

app.post('/signUp' , upload.fields([{name: 'f1'}]) , function(req , res){
    //console.log(req.body);
    //console.log(req.files);
    console.log(req.session);
    console.log(req.session.id);
    User.find({$or: [{email: req.body.emaiil} , {userName: req.body.userNamee}]})
        .then(function(usersArray){
            if(usersArray.length===0){
                if(req.body.passworrd === req.body.confirmPassworrd){
                    bcrypt.hash(req.body.passworrd , 10).then(function(hash){
                        req.body.passworrd = hash;

                        const newUser = {userName: req.body.userNamee , 
                                         email: req.body.emaiil , 
                                         password: req.body.passworrd , 
                                         image: 'userImg/' + req.files.f1[0].originalname};
                        User.create(newUser).then(function(user){ 
                            //console.log(user.userName);
                            req.session.userId = user._id;
                            //console.log(req.session.userId);
                            res.end();
                            // req.session.save(function(err){});                                    
                        });
                    });
                }
            }
            else {
                res.send('repeatedUser');
            }
        });
});

app.post('/logIn' , function(req , res){
    //console.log(req.session.id);
    //console.log(req.body)
    
    User.find({email: req.body.emaill}).then(function(users){
        //console.log(users)
        if(users.length===1){
            //console.log(users)
            bcrypt.compare(req.body.passwordd , users[0].password)
                  .then(function(result){
                    if(result === true){
                        req.session.userId = users[0]._id;
                        //console.log(req.session);
                        //console.log(req.session.id);
                        res.end(); 
                    }
                    else{
                        res.send("WrongPassword");
                    }                    
                  });
        }
        else{
            res.send('Email does not exist');
        }
    });
});


app.get('/logout' , function(req , res){
    //console.log(req.session);
	req.session.destroy(function(err){
		if(req.session === undefined){
			//console.log('session is distroyed');
            //console.log(req.session);
            //console.log(err);
			res.end();
		}
        else{
            console.log('errrrr');
  		    console.log(err);
            console.log(req.session);
            res.end();
        }
	});
});

app.get('/authentication' ,function(req , res){
    //console.log(req.session.userId)
    if(req.session.userId){
        User.findOne({_id: req.session.userId}).then(function(user){
            res.json({a: true , userInfo: user})
        })
    }
    else{
        res.json({a: false , userInfo: undefined})
    }
});

/**********************************************************************************/

app.post('/uploadVid' , upload.fields([{name: 'f2Thumb'} , {name: 'f3Vid'}]) , function(req ,res){
    
    //console.log(req.session.id);

    if(req.session.userId){
        //console.log(req.body);
        //console.log(req.files)
        const newVideo = {title: req.body.titlee , 
                      thumbnail: 'videoThumbnai/' + req.files.f2Thumb[0].originalname, 
                       videoUrl: 'videoUploaded/' + req.files.f3Vid[0].originalname,
                           user:  req.session.userId
                         };

        Video.create(newVideo).then(function(vid){
            //console.log(vid);
            res.end();
        });                               
    }
});

/**********************************************************************************/

app.get('/all' , function(req , res){
    //console.log(req.session.userId);
    let vidsFounded = Video.find({private: 'false'})
                             .populate({path: 'user' , model: User});
    
    if(req.query.word){
        vidsFounded = Video.find({$and:[ {$text:{ $search: req.query.word}} , {private: 'false'} ]}) // mongo shell create index
                           .populate({path: 'user' , model: User});
    }                         

    
    let sortBy = {date: -1};

    if(req.query.sortVids == 'mostPopular'){
        sortBy = {veiws: -1};
    }

    if(req.query.page == 1){
        vidsFounded.sort(sortBy).limit(4)
        .then(function(subVids){
            //console.log(sortBy)
            //console.log(subVids)
            res.json({subVids});
        });
    }
    else{
        let x = 4*(req.query.page - 1);
        vidsFounded.sort(sortBy).skip(x).limit(4)
        .then(function(subVids){
            res.json({subVids});
        });
    }    
})

/**********************************************************************************/

app.get('/all/:id' , function(req , res){
    //console.log(req.params.id)
    Video.findOneAndUpdate({_id: req.params.id} , {$inc: {veiws: 0.5}} , {new: true})
    .populate({
        path: 'user' , 
        model: User })
    .populate({
        path: 'comments' ,
        model: Comment ,
        populate: {
			path: 'replies' ,
			model: Reply ,
			populate: {
				path: 'user' ,
				model: User
			}	
		},
    })
    .populate({
        path: 'comments' ,
        model: Comment ,
        populate: {
            path: 'user',
            model: User
        }
    })
    .then(function(video , err){
        //console.log('ww')
        //console.log(err);
        //console.log(video.veiws);
        res.json(video)
    })
});

/**********************************************************************************/

app.get('/like/:id' , function(req,res){
    //console.log(req.params.id)
    if(req.session.userId){
        User.findOne({_id: req.session.userId}).then(function(user){
            if((user.videosLike).indexOf(req.params.id) === -1){
                Video.findOneAndUpdate({_id: req.params.id} , {$inc: {likes: 1}} , {new: true})   // https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
                     .populate({
                        path:'comments' , 
                        model: Comment ,
                        populate : {
                            path: 'user' ,
                            model: User
                        }
                    })
                     .then(function(video){
                        //console.log(video)
                        User.findOneAndUpdate({_id: req.session.userId} , {$push: {videosLike: video}} , {new: true})
                            .then(function(user){
                                //console.log(user.videosLike);
                                res.json({vid: video , likeActivation: 'likeIconActive'})
                            })
                     })
            }
            else {
                Video.findOneAndUpdate({_id: req.params.id} , {$inc: {likes: -1}} , {new: true})   // https://stackoverflow.com/questions/32811510/mongoose-findoneandupdate-doesnt-return-updated-document
                    .populate({
                        path:'comments' , 
                        model: Comment ,
                        populate : {
                            path: 'user' ,
                            model: User
                        }
                    })
                     .then(function(video){
                        //console.log(video)

                        User.findOneAndUpdate({_id: req.session.userId} , {$pull: {videosLike: video._id}} , {new: true}) // CastError: Cast to ObjectId failed for value "0" (type number) at path "videosLike" because of "BSONError"
                            .then(function(user){
                                //console.log(user.videosLike)
                                res.json({vid: video , likeActivation: 'likeIcon'})
                            }) 
                     })
            }
         })
     }
    else {
        console.log('there is no user');
        res.json({likeActivation: 'guestLike'})
    }
});

app.get('/isLiked/:id' , function(req , res){

	if(req.session.userId){
		User.findOne({_id: req.session.userId}).then(function(user){
			if((user.videosLike).indexOf(req.params.id) !== -1){
                res.json({likeActivation: 'likeIconActive'})
			}
			else{
				res.json({likeActivation: 'likeIcon'});
			}
		});
	}
    else {
        res.json({likeActivation: 'guestLike'})
    }	
});

/**********************************************************************************/

app.get('/rate/:id/:val' , function(req , res){

    if(req.session.userId){
        
        User.findOne({_id: req.session.userId}).then(function(user){
            //console.log(user.rated);
            const i = lookAt(user.rated , req.params.id);
            //console.log(i)
            if(i == -1) {
                //console.log(req.params.val);
				//console.log(user.rated[i]);
                Video.findOneAndUpdate({_id: req.params.id} , {$inc: {ratSum:req.params.val , ratNum:1}} , {new: true})
                    .populate({
                        path:'comments' , 
                        model: Comment ,
                        populate : {
                            path: 'user' ,
                            model: User
                        }
                    })
                     .then(function(video){
                         video.rating = video.ratSum/video.ratNum;

                         video.save().then(function(){ //https://stackoverflow.com/questions/75586474/mongoose-stopped-accepting-callbacks-for-some-of-its-functions
                             
                             //console.log(video.rating);
                             user.rated.push({vidId: video._id , vidRate: +(req.params.val)});
                             user.save()
                                 .then(function() {
                                    //console.log('check' , user.rated)
                                    res.json({rateActivation: 'checkedRed userRate' , yourRate: req.params.val , vid: video});
                                 })
                                 .catch(function(err) {
                                    console.log(err);
                                 })
                         }).catch(function(err) {
                            console.log(err);
                         })
                     })
            }
            else {
                console.log(user.rated[i].vidRate)
                Video.findOneAndUpdate({_id: req.params.id} , {$inc: {ratSum: -user.rated[i].vidRate , ratNum: -1}} , {new: true})
                    .populate({
                        path:'comments' , 
                        model: Comment ,
                        populate : {
                            path: 'user' ,
                            model: User
                        }
                    })
                     .then(function(video) {
                        console.log(video.ratSum)
                        console.log(video.ratNum)
                        if(video.ratNum == 0){
                            video.rating = 0
                        }
                        else{
                            video.rating = video.ratSum / video.ratNum;
                        }
                        
                        video.save().then(function(){
                            //console.log('here')
                            //console.log(video);
                            //console.log(err);
                            //console.log('before' , user.rated);
                            del(user.rated , req.params.id);
                            //console.log('after' , user.rated);
                            //console.log(user.rated[i]);

                            user.save().then(function(){
                                console.log('why?')
                                res.json({rateActivation: 'userRate' , yourRate: 0 , vid: video});
                            }).catch(function(err){
                                console.log(err)
                            })

                        }).catch(function(err){
                            console.log(err);
                        })
                     })

            }
        })
    }
    else {
        console.log('there is no user');  
        res.json({rateActivation: 'guestRate' , yourRate: 0});
    }
});

app.get('/isRated/:id' , function(req , res){

	if(req.session.userId){
		User.findOne({_id: req.session.userId}).then(function(user){
            //console.log(user.rated)
            const i = lookAt(user.rated , req.params.id);
			if(i == -1){
                res.json({rateActivation: 'userRate' , userRateVal: 0});
			}
			else{
                res.json({rateActivation: 'checkedRed userRate' , userRateVal: user.rated[i].vidRate});
			}
		});
	}
    else {
        res.json({rateActivation: 'guestRate' , userRateVal: 0})
    }	
});

/**********************************************************************************/

app.post('/comment/:id' , function(req , res){
   //console.log(req.body);
  
    if(req.session.userId){
        Comment.create({
            content: req.body.newComm , 
            user: req.session.userId , 
            parentVideo: req.params.id
        })
        .then(function(comm){
            //console.log(comm)
            Video.findOneAndUpdate({_id: req.params.id} , {$push: {comments: comm}} , {new: true})
            .populate({
                path:'comments' , 
                model: Comment ,
                populate : {
                    path: 'user' ,
                    model: User
                }
            })
            .then(function(vid){
                //console.log(vid.comments.length);
                User.findOne({_id:req.session.userId}).then(function(user){
                    if((user.videosCommented).indexOf(vid._id) == -1){
						user.videosCommented.push(vid._id);
                        user.save()
                            .then(function() {
                                //console.log(user.videosCommented);
                                //console.log(vid.comments);
                                //if(user._id == )
                                res.json(vid);
                            })
                            .catch(function(err) {
                                console.log(err);
                            })     
					}
					else{
                        //console.log(vid.comments);
                        res.json(vid);
						//res.json({arrUpdate: vid.comments});
					}
                });			
            });
        });
    }
});

app.put('/updateComm/:id' , function(req , res){//it works good with post
	console.log(req.body.updated);
	Comment.findOneAndUpdate({_id: req.params.id} , {$set: {content: req.body.updated}} , {new: true})
	.then(function(comm){
		console.log(comm);
	 	Video.findOne({_id: comm.parentVideo})
         .populate({
            path:'comments' , 
            model: Comment ,
            populate : {
                path: 'user' ,
                model: User
            }
        })
        .then(function(vid){
            res.json(vid);
        })
	});
});

app.delete('/del/:id/:idVid' , function(req,res){
	Comment.findOne({_id: req.params.id}).then(function(comm){
		User.findOneAndUpdate(
                {_id: comm.user} , 
                {$pull: {videosCommented: req.params.idVid}} , 
                {new: true})
            .then(function(user){
                Video.findOneAndUpdate({_id: req.params.idVid} , {$pull: {comments: req.params.id}} , {new: true})
                    .populate({
                        path:'comments' , 
                        model: Comment ,
                        populate : {
                            path: 'user' ,
                            model: User
                        }
                    })
                    .then(function(vid){
                        //extra: you have to delete its replies
                        Comment.deleteOne({_id: req.params.id}).then(function(result){
                            console.log(result);
                            res.json(vid);
                        });
                    });  
		});
	});
});

/**********************************************************************************/

app.post('/replyComm/:id' , function(req , res){
    console.log();
	if(req.session.userId){
		Reply.create({
            content:req.body.newReply , 
            user:req.session.userId , 
            parentComment:req.params.id
        })
		.then(function(rep){
            console.log(rep);
			Comment.findOneAndUpdate(
                {_id:req.params.id} , 
                {$push: {replies: rep}} , 
                {new:true})
            .populate({
                path: 'replies' ,
                model: Reply ,
                populate: {
                    path: 'user' ,
                    model: User
                }
            })
            .then(function(com){
				//console.log(com);
                res.json(com.replies);
			});
		});
	}
});

app.delete('/deleteRep/:idCom/:idRep' , function(req,res){
	Reply.deleteOne({_id: req.params.idRep}).then(function(result){
		//console.log(result);
		Comment.findOneAndUpdate({_id: req.params.idCom} , {$pull: {replies: req.params.idRep}} , {new:true})
        .populate({
            path: 'replies' , 
            model: Reply ,
            populate: {
                path: 'user' ,
                model: User
            }
        })
		.then(function(com){
			//console.log(com);
			res.json(com.replies);
		});
	});
});


app.listen(process.env.port || 4000 , function(){
    console.log("express app is ready");
});

//https://stackoverflow.com/questions/48367558/nodejs-express-session-don%C2%B4t-save-the-session
//https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/#:~:text=Express%2Dsession%20%2D%20an%20HTTP%20server,established%20on%20the%20server%2Dside.
//https://www.npmjs.com/package/express-session#options
