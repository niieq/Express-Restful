var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var Book = require('./models/book');
var User = require('./models/user');

var app = express();

// Connect to mongo db 
mongoose.connect('mongodb://127.0.0.1:27017/books');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());



// express router
var router = express.Router();

router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'specialforces', function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        message: 'unauthorized access. Create account at /users and authenticate at /authenticate' 
    });
    
  }
});

router.get('/', function(req, res) {
	res.json({'message': 'first'});
})

app.post('/users', function(req, res){
	var user = new User();
	user.username = req.body.username;
	user.password = req.body.password;

	user.save(function(err){
		if(err)
			res.send(err)
		res.json({message: 'User created Successfully.'})
	})
});

app.post('/authenticate', function(req, res){
   	
   	User.findOne({
	    username: req.body.username
	  }, function(err, user){

	    if (err) throw err;

	    if (!user){
	      res.json({message: 'User not found.'});
	    } else if (user){

	      // check if password matches
	      if (user.password != req.body.password) {
	        res.json({message: 'Wrong password.'});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign(user, 'specialforces', {
	          expiresIn: 60*24 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          message: 'Token Generated. Append to all requests',
	          token: token
	        });
	      }   

	    }

	  });
});


router.route('/books')

	.get(function(req, res){
		Book.find(function(err, books) {
			if(err)
				res.send(err)
			res.json(books)
		})
	})
	
	.post(function(req, res){
        
    var book = new Book();     
    book.title = req.body.title; 
    book.author = req.body.author; 
   
    book.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'New Book Added' });
    });
        
  });

router.route('/books/:btitle')

  .get(function(req, res){
      Book.find({title: req.params.btitle}, function(err, book){
          if (err)
              res.send(err);
          res.json(book);
      });
  })

  .delete(function(req, res){
      Book.remove({
          title: req.params.btitle
      }, function(err, book){
          if (err)
              res.send(err);

          res.json({ message: 'Book has been Successfully deleted' });
      });
  });

app.use('/api', router);
app.listen(8081)

console.log("Server started on port 8081")