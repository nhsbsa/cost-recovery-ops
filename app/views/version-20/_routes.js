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
    res.redirect('create-person-s2')
  }
  if (selectedRadio === "s1"){
    res.redirect('s1-status')
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
    res.redirect('so72-details')
  }
  if (selectedRadio === "no"){
    res.redirect('check-your-answers-no-s1')
  }
  else {
    res.redirect('have-s1')
  }

})

//s1-status.html
router.post('/s1-status', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "pensioner"){
    res.redirect('s1-rina-paper')
  }
  if (selectedRadio === "posted worker"){
    res.redirect('create-person-e106')
  }
  if (selectedRadio === "dependant of EU insured person"){
    res.redirect('create-person-e109')
  }
  else {
    res.redirect('s1-status')
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

//s1-eligibility.html
router.post('/eligible-s1', function (req, res) {

  const selectedRadio = req.body.s1;

  if (selectedRadio === "yes"){
    res.redirect('s071-institution-id-search')
  }
  if (selectedRadio === "no"){
    res.redirect('close-s1-reason')
  }
  else {
    res.redirect('s1-eligibility')
  }

})

//received-so72.html
router.post('/received-so72', function (req, res) {

  const selectedRadio = req.body.s1;

  if (selectedRadio === "yes"){
    res.redirect('add-s1-entitlement')
  }
  if (selectedRadio === "no"){
    res.redirect('upload-negative-so72')
  }
  else {
    res.redirect('received-so72')
  }

})

//claim-print-again.html
router.post('/print-again', function (req, res) {

  const selectedRadio = req.body.print;

  if (selectedRadio === "yes"){
    res.redirect('claim-print-confirmation')
  }
  if (selectedRadio === "no"){
    res.redirect('claim-print')
  }
  else {
    res.redirect('claim-print-again')
  }

})

//dl1609-response.html
router.post('/dl1609-response', function (req, res) {

  const selectedRadio = req.body.e106;

  if (selectedRadio === "change"){
    res.redirect('person-details-e106-2')
  }
  if (selectedRadio === "dependant"){
    res.redirect('create-dependant-e106')
  }
  if (selectedRadio === "cancel"){
    res.redirect('#')
  }
  else {
    res.redirect('s1-status')
  }

})


//s1-rina-paper.html
router.post('/s1-source', function (req, res) {

  const selectedRadio = req.body.source;

  if (selectedRadio === "rina"){
    res.redirect('rina-personal-details-s1')
  }
  if (selectedRadio === "paper"){
    res.redirect('create-person-s1')
  }
  else {
    res.redirect('s1-status')
  }

})

//received-so72-dependant.html
router.post('/received-so72-dep', function (req, res) {

  const selectedRadio = req.body.s1;

  if (selectedRadio === "yes"){
    res.redirect('dependant-confirmed')
  }
  if (selectedRadio === "no"){
    res.redirect('upload-negative-so72-dependant')
  }
  else {
    res.redirect('received-so72-dependant')
  }

})

//not-registered-reason.html
router.post('/not-registered-reason', function (req, res) {

  const selectedRadio = req.body.s1;

  if (selectedRadio === "1"){
    res.redirect('check-your-answers-not-registered-s1')
  }
  if (selectedRadio === "3"){
    res.redirect('uk-pension-start-date')
  }
  if (selectedRadio === "4"){
    res.redirect('uk-tax-start-date')
  }
  if (selectedRadio === "5"){
    res.redirect('check-your-answers-not-registered-s1')
  }
  if (selectedRadio === "6"){
    res.redirect('date-of-death')
  }
  else {
    res.redirect('not-registered-reason')
  }

})

//close-s1-reason.html
router.post('/close-s1-reason', function (req, res) {

  const selectedRadio = req.body.s1;

  if (selectedRadio === "1"){
    res.redirect('close-s1')
  }
  if (selectedRadio === "2"){
    res.redirect('close-s1')
  }
  if (selectedRadio === "3"){
    res.redirect('uk-pension-start-date-2')
  }
  if (selectedRadio === "4"){
    res.redirect('uk-tax-start-date-2')
  }
  if (selectedRadio === "5"){
    res.redirect('close-s1')
  }
  if (selectedRadio === "6"){
    res.redirect('date-of-death-2')
  }
  else {
    res.redirect('close-s1-reason')
  }

})




module.exports = router;
