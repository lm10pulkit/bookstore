var mongoose=require('mongoose');
var schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/bookstore');
var userschema= require('./userschema.js');
var bookschema = require('./bookschema.js');
var user= mongoose.model('user',userschema);
var book= mongoose.model('book',bookschema);
var wishlist = require('./wishlistschema.js');
var save=function(data,callback){
  var new_user= new user(data);
  new_user.save(callback);
};
var findbyusername=function(username,callback){
     user.findOne({username:username},callback);
};
var findbyid = function(id,callback){
      user.findById(id,callback);
};
var userupdate= function(id,data,callback){
    user.update({_id:id},{name:data.name,no:data.no},callback);
};
var bookadd = function(id,data,callback){  
    var new_book = {
     userid:id.toString(),
     name:data.name,
     author:data.author,
     tags:data.tags
    };
    var book1 = new book(new_book);
    book1.save(callback);
};
var addtags= function(bookid,tagname,callback){
    book.update({_id:bookid},{$push: {tags: tagname}},callback);
};
var increasepopularity= function(bookid,callback){
     book.update({ _id:bookid},{$inc:{popularity:-1}},callback);
};
var  bookpost= function(callback){
      book.find().sort({popularity:1}).then(callback);
};
var mybook = function(id,callback){
  book.find({userid:id},callback);
};
var editbook = function(bookid,data, callback){
 book.update({_id:bookid},data,callback);
};
var deletebook = function(bookid, callback){
book.remove({_id:bookid},callback);
};
var findbookbyid = function(bookid,callback){
book.findOne({_id:bookid},callback);  
};
var additem = function(userid,bookid,callback){

     wishlist.find({userid:userid,bookid:bookid},function(err,data){
        if(data.length>0){
          console.log('positive still negative');
          return callback(err,data);
        }
        else
        {
           wishlist.update({userid:userid},{$push:{bookid:bookid}},callback);
        }
     });
};
var removeitem= function(userid,bookid,callback){
     wishlist.update({userid:userid},{$pull :{bookid: bookid}},function(err,data){
      console.log(data);
     });
};
  module.exports={
   findbyusername,
   save,
   findbyid,
   userupdate,
   bookadd,
   addtags,
   increasepopularity,
   bookpost,
   mybook,
  deletebook,
  editbook,
  findbookbyid,
  additem,
  removeitem
};
//editbook ('5a62f365dbe55622849bf606',{name:'shvshsc'},function(err,data){
  // console.log(data);
//})
//removeitem("pulkit","job",function(err,data){
  //  console.log(data);
//});
