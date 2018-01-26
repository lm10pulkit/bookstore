var mongoose = require('mongoose');
var schema =  mongoose.Schema;
var cartschema = new schema ({
   userid:{
   	type:String
   },
   bookids:[String]
});
module.exports= cartschema;