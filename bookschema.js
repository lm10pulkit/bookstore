var mongoose= require('mongoose');
var schema = mongoose.Schema;
var bookschema = new schema({
	userid:{
       type:String ,
       required:true
	},
  name :{
  	type:String ,
     required:true	
  },
  author:{
  	type:String
  },
  tags:[String]
  ,
  popularity:{
  	type:Number,
  	default :0
  }
});
module.exports=bookschema;
