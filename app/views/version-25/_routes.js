// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JS0N bodies
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

//s1-select-action.html
router.post('/select-action', function (req, res) {

  const selectedRadio = req.body.entitlement;

  if (selectedRadio === "s1"){
    res.redirect('s1-reg-pin-name-dob')
  }
  if (selectedRadio === "s2"){
    res.redirect('s1-cancel-search-pin')
  }
  else {
    res.redirect('s1-reg-pin-name-dob')
  }

})

//s1-have-s1.html
router.post('/have-s1', function (req, res) {

  const selectedRadio = req.body.s1;

  if (selectedRadio === "yes"){
    res.redirect('s1-so72-details')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-check-your-answers-no-s1')
  }
  else {
    res.redirect('s1-have-s1')
  }

})

//s1-status.html
router.post('/s1-status', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "pensioner"){
    res.redirect('s1-create-person2')
  }
  if (selectedRadio === "dependant of pensioner"){
    res.redirect('s1-status')
  }
  if (selectedRadio === "posted worker"){
    res.redirect('s1-status')
  }
  if (selectedRadio === "dependant of posted worker"){
    res.redirect('s1-status')
  }
  if (selectedRadio === "dependant of EU insured person"){
    res.redirect('s1-status')
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
    res.redirect('print-so71')
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
    res.redirect('upload-negative-so73')
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

//create-person-entitlement.html
router.post('/select-entitlement', function (req, res) {

  const selectedRadio = req.body.entitlement;

  if (selectedRadio === "s2"){
    res.redirect('s1-details')
  }
  if (selectedRadio === "s1"){
    res.redirect('s1-details')
  }
  if (selectedRadio === "ehic"){
    res.redirect('s1-details')
  }
  if (selectedRadio === "prc"){
    res.redirect('s1-details')
  }
  else {
    res.redirect('s1-details')
  }

})

//s1-or-s072-received.html
router.post('/s1-or-s072-received', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-status')
  }
  if (selectedRadio === "no"){
    res.redirect('prefilled-fsa1-received')
  }
  else {
    res.redirect('s1-or-s072-received')
  }

})

//prefilled-fsa1-received.html
router.post('/prefilled-fsa1-received', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-enter-fas1-details-previous-name')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-print-fas1-confirmation')
  }
  else {
    res.redirect('prefilled-fsa1-received')
  }

  })

//s1-fas1-create-person-dependent.html
router.post('/s1-fas1-create-person-dependent', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-fas1-create-person-dependent')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-fas1-check-your-answers')
  }
  else {
    res.redirect('s1-fas1-any-dependents')
  }

})

//s1-fas1-create-person-dependent-loop.html
router.post('/s1-fas1-create-person-dependent-loop', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-fas1-create-person-dependent')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-fas1-check-your-answers-with-dependents')
  }
  else {
    res.redirect('s1-fas1-any-more-dependents')
  }

})

//s1-create-person-dependent.html
router.post('/s1-create-person-dependent', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-create-person-dependent')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-check-your-answers-final')
  }
  else {
    res.redirect('s1-any-dependents')
  }

})

//s1-create-person-dependent-loop.html
router.post('/s1-create-person-dependent-loop', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-create-person-dependent')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-check-your-answers-with-dependents')
  }
  else {
    res.redirect('s1-any-more-dependents')
  }

})

//add-new-entitlement.html
router.post('/add-new-entitlement', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "s2/e122"){
    res.redirect('s1-or-s072-received')
  }
  if (selectedRadio === "prc"){
    res.redirect('s1-or-s072-received')
  }
  else {
    res.redirect('s1-or-s072-received')
  }

})

module.exports = router;
