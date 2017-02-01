var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
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
    // Check here for authorization
    next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
	res.json({'message': 'first'});
})

router.route('/users')
	
	.post(function(req, res){
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err){
			if(err)
				res.send(err)
			res.json({message: 'User created Successfully.'})
		})
	})


router.route('/books')

	.get(function(req, res) {
		Book.find(function(err, books) {
			if(err)
				res.send(err)
			res.json(books)
		})
	})
	
	.post(function(req, res) {
        
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

  .get(function(req, res) {
      Book.find({title: req.params.btitle}, function(err, book) {
          if (err)
              res.send(err);
          res.json(book);
      });
  })

  .delete(function(req, res) {
      Book.remove({
          title: req.params.btitle
      }, function(err, book) {
          if (err)
              res.send(err);

          res.json({ message: 'Book has been Successfully deleted' });
      });
  });

app.use('/', router);
app.listen(8081)

console.log("Server started on port 8081")