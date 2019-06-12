var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/', function(req, res, next) {
  console.log("主页");
  res.send("this message is from index.js")
});
router.get('/layui', function(req, res, next) {
  res.render('layui');
});
router.get('/test', function(req, res, next) {
  res.render('test');
});
module.exports = router;
