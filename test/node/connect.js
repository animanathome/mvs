var mongoose = require('mongoose');
console.log('connecting')
var db = mongoose.connect('mongodb://mongo:27017/mvs', { useMongoClient: true }, function(err){	
	if(err){
		console.log(err)
	}else{
		console.log('successfully connected to mongo database')
	}
});
// console.log(db)
 var userSchema = new mongoose.Schema({name:String,password:String});
 var userModel =db.model('userlists',userSchema);
 var anand = new userModel({ name: 'anand', password: 'abcd'});
 anand.save(function (err, docs) {
   if (err) {
       console.log('Error');
   } else {
       userModel.count({name: 'anand'}, function(err, c) {
           console.log('Count is ' + c);
      });
   }
 }); 