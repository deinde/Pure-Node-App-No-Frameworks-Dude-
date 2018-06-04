/*
 * this is used to store and edit data
 *
 *
 */

 //Dependencies

 let fs = require('fs');
 let path = require('path');

 //Container for module export

 let lib={};

//base directory of data folder

lib.baseDir =path.join(__dirname,'/../.data/');

//function to write data to a file
//params are dir which will be several folders inside .data folder
//file that we will write to inside the particular dir and the actual data we
//write and last a call back



//Create a file
lib.create = function(dir,file,data,callback){
    
    //first open file that we want to write to
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
       
        if(!err && fileDescriptor){
            //covert data to string and write it to the file
        
        let stringData = JSON.stringify(data);
        
        
        //now write to file
         
        fs.writeFile(fileDescriptor,stringData,function(err){
             if(!err){
                 //close file if there is no error. Use fs.close
               fs.close(fileDescriptor,function(err){
                   if(!err){
                      callback(false)
                   }else{
                       callback('error closing file')
                   }
               });
             }else{
                 callback('error writing to new file')
             }
         })
        }else{
            callback('Could not create new file. It may already exist')
        }
    })

}



//Read in some data!!!
lib.read = function(dir,file,callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf-8', function(err,data){
      callback(err,data);
    });
  };



 //Update file
 
 lib.update = function(dir,file,data,callback){
   fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
     if(!err && fileDescriptor){
         //convert the data to a string
         let stringData = JSON.stringify(data);

         //truncate the data
         fs.ftruncate(fileDescriptor,function(err){
             if(!err){
              fs.writeFile(fileDescriptor,stringData,function(err){
                  if(!err){
                   fs.close(fileDescriptor,function(err){
                    if(!err){
                      callback(false)
                    }else{
                      callback('error closing file')
                    }
                   })
                  }else{
                   callback('Error updating existing file during writeFile method')
                  }
              });
             }else{
                 callback('Error Truncating the file')
             }
         })
        
     }else{
         callback('Could Not open or update the file, may not exist yeat')
     }
   })
 }
//Delete the file
lib.delete = function(dir,file,callback){
    
    //unlinking the file from the file system !!!
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
         callback(false)
        }else{
            callback('Error deleting file')
        }
    })

}

//export module
 module.exports = lib;