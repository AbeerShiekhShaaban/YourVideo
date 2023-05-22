const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {type:String , required: true , trim: true , text: true}, // create index text using mongo shell
    thumbnail: {type:String , required:true , trim: true},
	videoUrl: {type: String , required: true , trim: true},
    date: { type: Date, default: Date.now , trim: true},
    user: {type: mongoose.Schema.Types.ObjectId , ref: 'User'},
    comments: [{type: mongoose.Schema.Types.ObjectId , ref: 'Comment'}],
    veiws: {type: Number , default: 0},
	likes: {type: Number , default: 0},
    private: {type: String , default: 'false'},
    rating: {type: Number , default: 0},
	ratSum: {type: Number , default: 0},
	ratNum: {type: Number , default: 0}    
});
const Video = mongoose.model('video' , videoSchema);
exports.Video = Video;

/**************************************************************************/

const subDocRated = new mongoose.Schema({
	vidId: String,
	vidRate: Number
});

const userSchema = new mongoose.Schema({
    userName: {type:String , required:true , trim: true},
	email: {type:String , required:true , trim: true},
	password: {type:String , required:true , trim: true},
	image: {type:String , trim: true , default: 'abeer\\uploaded\\15163358e05ad5ba82e65b9753ed41a5'},
    videosUploaded: [{type: mongoose.Schema.Types.ObjectId , ref: 'Video'}],
	videosCommented: [{type: mongoose.Schema.Types.ObjectId , ref: 'Video'}],
	videosLike: [{type: mongoose.Schema.Types.ObjectId , ref: 'Video'}],
	rated: [subDocRated]
});
const User = mongoose.model('user' , userSchema);
exports.User = User;

/**************************************************************************/

const commentSchema = new mongoose.Schema({
	content: {type:String , required:true , trim: true},
	user: {type: mongoose.Schema.Types.ObjectId , ref: 'User'},
	date: { type: Date, default: Date.now , trim: true},
	replies: [{type: mongoose.Schema.Types.ObjectId , ref: 'Reply'}],
	parentVideo: {type: mongoose.Schema.Types.ObjectId , ref: 'Video'}
});
const Comment = mongoose.model('comment' , commentSchema);
exports.Comment = Comment;

/**************************************************************************/

var replySchema = new mongoose.Schema({
	content: {type:String , required:true , trim: true},
	user: {type: mongoose.Schema.Types.ObjectId , ref: 'User'},
	date: { type: Date, default: Date.now , trim: true},
	parentComment: {type: mongoose.Schema.Types.ObjectId , ref: 'Comment'}
});
var Reply = mongoose.model('reply' , replySchema);
exports.Reply = Reply;




 
// The issue with this code is that User is not defined when used as a value for the ref property in videoSchema.

// In videoSchema, the ref property of the user field should be a string that corresponds to the name of the related model, like this: