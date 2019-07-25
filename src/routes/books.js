'use strict';

const express = require('express');
const router = express.Router();

router.get('/books', handleGetAll);
router.get('/books/:id', handleGetOne);



// Route Handlers
/**
 * Retrive all the books in the database
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function handleGetAll(req, res, next) {
  let books = {
    count: 3,
    results: [
      { title:'Moby Dick' },
      { title:'Little Women' },
      { title: 'Eloquent Javascript' },
    ],
  };
  res.status(200).json(books);
}

/**
 *Retrive one book
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function handleGetOne(req, res, next) {
  let book = {
    title:'Moby Dick',
  };
  res.status(200).json(book);
}

module.exports = router;
