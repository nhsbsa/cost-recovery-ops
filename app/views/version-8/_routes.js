// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


//account-requests-process.html
router.post('/select-decision', function (req, res) {

  const selectedRadio = req.body.accountReq;

  if (selectedRadio === "accept"){
    res.redirect('account-requests-accepted-confirmation')
  }
  if (selectedRadio === "reject"){
    res.redirect('account-requests-process-reason')
  }
  else {
    res.redirect('account-requests-process')
  }

})


module.exports = router;
