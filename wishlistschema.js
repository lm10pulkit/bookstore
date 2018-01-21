var mongoose= require('mongoose');
var schema = mongoose.Schema;
var bookschema = require('./bookschema.js');
var wishlistschema = new schema({
userid :{
	type:String ,
	required:true,
	unique:true
},
bookid:[{
	type:String,
	unique:true
}]
});
var wishlist = mongoose.model('wishlist',wishlistschema);
module.exports=wishlist;

