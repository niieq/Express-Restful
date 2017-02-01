var mongoose = require('mongoose');

var schema = mongoose.Schema;

var BookSchema = new schema({
	title: String,
	author: String
});

module.exports = mongoose.model('Book', BookSchema);