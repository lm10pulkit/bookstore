var prefixmatch = function(word1,word2, callback){
	var len = word1.length>word2.length?word2.length:word1.length;
	var num=0;
	for (var x=0;x<len;x++)
	{
	
       if(word1.charAt(x)!=word2.charAt(x)){
       	return callback(false);
       	
       	console.log(num);
       }
       else
       	num++;
       if(num==len)
       	return callback(true);
	}  
};
var providearray   = function(word1,word2,callback){
	var arr=[];
	for(var x=0;x<=word1.length;x++){
		arr[x]=[];
		for(var y =0;y<=word2.length;y++){
                if(x==0)
                	arr[x][y]=y;
               if(y==0)
               	     arr[x][y]=x;
               	 if(x==word1.length&&y==word2.length)
               	 	return callback(arr);
		}
   	}
     
};
var editdistance = function(word1,word2,callback){
	  providearray(word1,word2,function(arr){
         for(var x=0;x<word1.length;x++){
         	for(var y =0;y<word2.length;y++)
         	{  
               if(word1.charAt(x)==word2.charAt(y))
                  arr[x+1][y+1]=  arr[x][y];
                 else
                 {
                 	var min = arr[x+1][y]>arr[x][y+1]?arr[x][y+1]:arr[x+1][y];
                 	min = arr[x][y]>min?min:arr[x][y];
                 	arr[x+1][y+1]= min+1;

                 }    
         	  
         	if(x==word1.length-1&&y==word2.length-1)
         		callback(arr[x+1][y+1]);

            }
         }
	  });
};

var substring = function(word1,word2,callback){
	   if(word2.length>word1.length){
	   	var  temp=word2;
	   	word2= word1;
	   	word1=temp;
	   }

    for(var x=0;x<=word1.length-word2.length;x++)
    { 
        if(word1.substring(x,x+word2.length)==word2){
        	return callback(true);
        }
        if(x==word1.length-word2.length)
        return callback(false);	
    }
    
};
var search =function(word1,word2,callback){
   prefixmatch(word1,word2,function(pmatch){
   	  
   	   if(pmatch)
   	   	return callback(true,0);
   	   else{
   	   	substring(word1,word2,function(smatch){
         if(smatch)
         	return callback(true,1);
         else
         {
         	editdistance(word1,word2,function(val){
                  if(val<7)
                  	return callback(true,val);
                  else
                  	return callback(false, val);

         	});
         }
   	   	});
   	   }
   });
};
var removeextraspaces= function(str,callback){
     initialspace(str,function(str1){
          endspace(str1,function(str2){
             middlespace(str2,function(str3){
                callback(str3);
             });
          });
     });
};
var initialspace = function(str,callback){
     for(var x=0;x<str.length;x++){
     	 if(str.charAt(x)!=' ')
     	 {
              return callback(str.substring(x,str.length));
     	 }
     	if(x==str.length-1)
     		return callback('');
     }
};
var endspace= function(str,callback){
	for(var x= str.length-1;x>=0;x--){
       if(str.charAt(x)!=' ')
       {
            return callback(str.substring(0,x+1));
       }
       if(x==0)
       	 return callback(str.substring(''));
	}
};
var middlespace = function(str,callback){
	var str1=str.charAt(0);
    for(var x=1;x<str.length;x++){
    	if(str.charAt(x)!=' '||(str.charAt(x)==' '&& str.charAt(x-1)!=' '))
    		str1= str1+str.charAt(x);
    	if(x==str.length-1)
    		return callback(str1);
    }
};
var stringtoarray = function(str, callback){
	var strarr=[];
       spacearray(str,function(arr){
          for(var x =0;x<arr.length-1;x++){
              if(arr[x]!=arr[x+1]-1)
              {
                strarr.push(str.substring(arr[x],arr[x+1]-1));
              }
              if(x==arr.length-2)
              	return callback(strarr);
          }
       });
};
var spacearray = function(str, callback){
    var arr=[];
    str =" "+str +" ";
    for(var x =0;x<str.length;x++){
    	if(str.charAt(x)==' ')
    		arr.push(x);
    //	if(x==str.length-1)
    	//	 callback(arr);
    }
    return arr;
};
var arrsrc= function(str, str2, callback){
    stringtoarray(str,function(strarr){
         stringtoarray(str2,function(strarr2){
         	    var totalval=0;
         	    var num=0;
              for(var x =0 ;x<strarr.length;x++)
              {
                for(var y =0;y<strarr2.length;y++)
                {
                  editdistance(strarr[x],strarr2[y],function(val){
                      if(val<4)
                      	totalval++;

                        num++;

                        if(num==strarr.length*strarr2.length)
                        	return callback(totalval,strarr.length);
                  });
                }
              }
         });
    });
};
var magic = function(str,data,callback){
	  var num=0;
	  var arr=[];
     for(var x =0 ; x<data.length;x++)
     {
        arrsrc(str,data[x].text,function(totalval,len){
             if(totalval>=len)
             	arr.push(data[x].text);
             num++;
             if(num==data.length)
                return callback(arr);
        });
     }
};
