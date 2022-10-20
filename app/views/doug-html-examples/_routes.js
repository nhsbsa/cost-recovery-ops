// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

// Add your routes here - above the module.exports line
router.get('/', function(req , res){ 
  res.render('index');
 });

 //doug-html-examples
 router.post('/quota-number-check', function (req, res) {

  const selectedRadio = req.body.quotaNumber;

  if (selectedRadio === "22/23-100"){
    res.redirect('routing-output-a')
  }
  else {
    res.redirect('routing-output-b')
  }

})


module.exports = router;