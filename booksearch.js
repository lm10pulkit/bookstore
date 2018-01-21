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