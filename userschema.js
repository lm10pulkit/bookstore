var mongoose= require('mongoose');
var schema = mongoose.Schema;
var userschema = new schema ({
      name :{
      	type:String
      },
      username:{
      	type:String ,
      	required:true,
      	unique:true
      },
      password:{
      	type:String ,
      	required:true
      },
      no:{
      	type:Number
      }
});
module.exports=userschema;
