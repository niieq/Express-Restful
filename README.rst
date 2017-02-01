A Restful Service with Express and Mongo
========================

Create a restful service for Books with CREATE, READ and DELETE with authorization.

Setup
-----

.. code-block:: bash
	
	$ npm install

	$ npm start

Usage
-----

Create user by making a post request to /users.

Authenticate to generate a token by a post request to /authenticate

Add token in HTTP header as x-access-token or pass in url as ?token= on requests made on books.

To create new book, make post request to /api/books

To read, make get request to /api/books/:title

To delete, send http delete request to /api/books/:title

