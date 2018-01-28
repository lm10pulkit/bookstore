var express= require('express');
var app= express();
var bodyparser= require('body-parser');
var cookieparser= require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var localstrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var {hash,compare}= require('./hashing.js');
var {findbyusername,
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
   createwishlist,
   findwishlist,
   removeitem
 }= require('./db.js');
var {findbook} = require('./book.js');
var loggedin = function(req,res,next){
if(req.user)
  next();
else
  res.redirect('/');
} ; 
//view engine
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
//for forms
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// middleware for cookie parser
app.use(cookieparser());

//middleware for session
app.use(session(
	{
		secret:'secret',
	    saveUninitialized:true,
		resave:true
	}));
//middleware for passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash for flashing messages
app.use(flash());
//serializing user
passport.serializeUser(function(user,done){
    done(null,user._id);
});
//deserializing user
passport.deserializeUser(function(id,done){
	findbyid(id,function(err,user){
       done(err,user);
	});
});
app.use(function(req,res,next){
   res.locals.session= req.session;
   next();
});
passport.use('local.signup',new localstrategy({
usernameField :'username',
passwordField : 'password',
passReqToCallback:true
},function(req,username,password,done){
     findbyusername(username,function(err,user){
       if(err){
       	return done(err,false);
       }
       if(user)
       {
       return  done(err,false,{message:'email is already in use'});
       }
       hash(password,function(err,hash){
        if(err)
          throw err;
        var body ={
          username:username,
          password:hash
        };
         save(body,function(err,data){
             console.log(data);
             return done(null,data);
         });
       });
     });
}));
passport.use('local.signin',new localstrategy({
usernameField :'username',
passwordField : 'password',
passReqToCallback:true
},function(req,username,password,done){
     findbyusername(username,function(err,user){
         if(err)
           return done(err,false);
        if(!user){
          return done(null,false,{message:'user does not exsist'});
        }
          compare(password,user.password,function(err,check){
              if(err)
                throw err;
              if(check)
              return  done(null,user);
               else
             return done(null,false);
          });
     });
}));
app.get('/',function(req,res){
       res.render('signup.ejs');
});
app.post('/signup',passport.authenticate('local.signup',{failureRedirect:'/'}),function(req,res){
         createwishlist(req.user.id.toString(),function(err,data){
          
            console.log(data);
         });
         res.redirect('/adddetails');
  
});
app.post('/login',passport.authenticate('local.signin',{failureRedirect:'/'}),function(req,res){
      res.redirect('/addbook');
});
app.get('/addbook',loggedin,function(req,res){
   res.render('addbook');
});
app.post('/addbook',function(req,res){
  console.log('in the add book');
  console.log(req.user._id);
  console.log(req.body);
   bookadd(req.user.id,req.body,function(err,data){
      console.log(data);

   });
   res.redirect('/addbook');
});
app.get('/adddetails',loggedin, function(req,res){
      res.render('adddetails');
});
app.post('/adddetails',loggedin,function(req,res){
    userupdate(req._id,req.body, function(err,data){
       if(err)
        throw err;
      console.log(data);
      res.redirect('/addbook');
    });
});
app.get('/mybook',loggedin,function(req,res){
  mybook(req.user._id,function(err,data){
       console.log(data);
      res.render('mywall',{books:data});
  });
});
app.get('/deletebook',loggedin, function(req,res){
     var bookid = req.query.bookid;
     deletebook(bookid,function(err,data){
           console.log(data);
           res.redirect('/mybook');
     });
});
app.get('/editbook',loggedin, function(req,res){
         res.render('editdetail',{bookid:req.query.bookid});
});
app.get('/viewbook', loggedin , function(req,res){
         var bookid = req.query.bookid;
         findbookbyid(bookid,function(err,data){
              res.render('book',{book:data});
         });
});
app.post('/editbook',loggedin,function(req,res){
    var bookid= req.query.bookid;
     editbook(bookid,req.body,function(err,data){
       if(err)
        throw err;
        console.log(data);
        res.redirect('/viewbook?bookid='+bookid);
     });
});
app.post('/addtag', loggedin, function(req,res){
    var bookid = req.query.bookid;
    addtags(bookid.toString(),req.body.tags,function(err,data){
      if(err)
        throw err;
       console.log(data);
       res.redirect('/viewbook?bookid='+bookid);
    });
});
app.get('/public',loggedin,function(req,res){
    bookpost(req.user._id.toString(),function(data){
        console.log(data);
       res.render('public',{books:data});
    });
});
app.get('/authprof',loggedin,function(req,res){
       var bookid = req.query.bookid;
       var userid = req.query.userid;
       console.log(userid);
       increasepopularity(bookid,userid,function(err,data){
        console.log(data);
       });
       res.redirect('/public');
});
app.get('/addtowishlist',function(req,res){
    var bookid= req.query.bookid;
    var userid= req.user._id;
    console.log(req.query.bookid);
    additem(userid.toString(),bookid.toString(),function(err,data){
        console.log(data);
    });
    res.redirect('/wishlist');
});
app.get('/wishlist',loggedin,function(req,res){
      findwishlist(req.user._id,function(err,data){
          res.render('wishlist',{books:data});
      }); 
});
app.get('/removeitem',loggedin,function(req,res){
  var userid= req.user.id;
  var bookid = req.query.bookid;
  removeitem(userid,bookid,function(err,data){
            console.log(data);
  });
  res.redirect('/wishlist');
});
app.get('/search',function(req,res){
  if(req.user){
    bookpost(req.user._id.toString(),function(data){
         
        findbook(req.query.search,data,function(data1){
                res.render('findbook',{books:data1});
        });
  
    });
    }
});
app.get('/logout',loggedin,function(req,res){
  req.logout();
  res.redirect('/');
});
app.listen(8080,function(err){
 if(err)
  console.log(err);
else
  console.log('connected to the port');
});