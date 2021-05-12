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

//create-person-entitlement.html
router.post('/select-entitlement', function (req, res) {

  const selectedRadio = req.body.entitlement;

  if (selectedRadio === "s2"){
    res.redirect('address-details')
  }
  if (selectedRadio === "s1"){
    res.redirect('uk-address')
  }
  if (selectedRadio === "ehic"){
    res.redirect('create-person-entitlement')
  }
  if (selectedRadio === "prc"){
    res.redirect('create-person-entitlement')
  }
  else {
    res.redirect('create-person-entitlement')
  }

})

//have-s1.html
router.post('/have-s1', function (req, res) {

  const selectedRadio = req.body.s1;

  if (selectedRadio === "yes"){
    res.redirect('s1-details')
  }
  if (selectedRadio === "no"){
    res.redirect('check-your-answers-no-s1')
  }
  else {
    res.redirect('have-s1')
  }

})

//s1-details.html
router.post('/registered', function (req, res) {

  const selectedRadio = req.body.registered;

  if (selectedRadio === "registered"){
    res.redirect('s1-institution-id-search')
  }
  if (selectedRadio === "not registered"){
    res.redirect('not-registered-reason')
  }
  else {
    res.redirect('s1-details')
  }

})


module.exports = router;
