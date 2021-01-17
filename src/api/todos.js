/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable consistent-return */
const express = require('express');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

const Todo = require('../db/todoSchema');

const router = express.Router();

const desiredCacheTime = 30 * 1000; // 30 secs.

const limiter = rateLimit({
  windowMs: desiredCacheTime, // 30 secs.
  max: 100, // limit each IP to 100 requests per windowMs
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 30 secs.
  delayAfter: 50, // allow 50 requests per desired time limit, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
});

// In memory cache. This could be changed with Redis or Memcached or some other cache layer
let cachedData;
let cacheTime;

// Get all todos
router.get('/', limiter, speedLimiter, async (req, res, next) => {
  // if (cacheTime && cacheTime > Date.now() - desiredCacheTime) {
  //   return res.json(cachedData);
  // }

  try {
    await Todo.find().then((todo) => {
      cacheTime = Date.now();
      todo.cacheTime = cacheTime;
      cachedData = todo;
      return res.json(todo);
    });
  } catch (err) {
    return next(err);
  }
});

// Add one todo
router.post('/', limiter, speedLimiter, async (req, res, next) => {
  try {
    const { content, completed } = req.body;
    const todo = {
      content,
      completed,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const todoModal = new Todo(todo);
    await todoModal.save();

    if (cachedData) {
      cachedData.push(todoModal);
      cacheTime = Date.now();
    }
    res.json(todoModal);
  } catch (err) {
    next(err);
  }
});

// Update one todo
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = {
      ...req.body,
      updatedAt: Date.now(),
    };

    await Todo.findByIdAndUpdate(id, todo);
    cachedData &&
      cachedData.map((todoItem, index) => {
        if (todoItem.id === id) {
          cachedData[index] = { ...todo };
          cacheTime = Date.now();
        }
      });
    return res.json(todo);
  } catch (err) {
    next(err);
  }
});

// Delete one todo
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id, (err) => {
      if (err) next(err);
    });
    cachedData &&
      cachedData.map((todoItem, index) => {
        if (todoItem._id === id) {
          cachedData.splice(index, 1);
          cacheTime = Date.now();
        }
      });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
