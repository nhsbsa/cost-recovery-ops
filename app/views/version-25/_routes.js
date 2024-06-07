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

//select-action.html
router.post('/select-action', function (req, res) {

  const selectedRadio = req.body.entitlement;

  if (selectedRadio === "s1"){
    res.redirect('s1-prefilled-s072-received')
  }
  if (selectedRadio === "s2"){
    res.redirect('s1-select-action')
  }
  if (selectedRadio === "s3"){
    res.redirect('s1-select-action')
  }
  if (selectedRadio === "s4"){
    res.redirect('s1-select-action')
  }
  else {
    res.redirect('s1-select-action')
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

//s1-details.html
router.post('/registered', function (req, res) {

  const selectedRadio = req.body.registered;

  if (selectedRadio === "registered"){
    res.redirect('s1-add-institution-details-search-results')
  }
  if (selectedRadio === "not registered"){
    res.redirect('s1-details')
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
    res.redirect('s1-details')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-prefilled-fas1-received')
  }
  else {
    res.redirect('s1-prefilled-fas1-received')
  }

})

//prefilled-fas1-received.html
router.post('/prefilled-fas1-received', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-fas1-details')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-print-fas1-instructions')
  }
  else {
    res.redirect('s1-prefilled-fas1-received')
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

//what-action-to-take.html
router.post('/what-action-to-take', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "FAS1"){
    res.redirect('what-action-to-take')
  }
  if (selectedRadio === "FAS1Form"){
    res.redirect('what-action-to-take')
  }
  if (selectedRadio === "AddNew"){
    res.redirect('what-action-to-take')
  }
  if (selectedRadio === "DepDet"){
    res.redirect('what-action-to-take')
  }
  else {
    res.redirect('what-action-to-take')
  }

})

//s1-any-dependent.html
router.post('/s1-any-dependent', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-print-dl1609-instructions')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-print-s073-instructions')
  }
  else {
    res.redirect('s1-do-you-have-dependents')
  }

})

//s1-entitlement-treatment-cancelled-reason.html
router.post('/s1-entitlement-treatment-cancelled-reason', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "entitlementCancelReason"){
    res.redirect('s1-entitlements-treatments-cancelled-s1-confirmation')
  }
  if (selectedRadio === "entitlementCancelReason-2"){
    res.redirect('s1-entitlements-treatments-cancelled-s1-confirmation')
  }
  if (selectedRadio === "entitlementCancelReason-3"){
    res.redirect('s1-entitlements-treatments-cancelled-s1-confirmation')
  }
  if (selectedRadio === "entitlementCancelReason-4"){
    res.redirect('s1-entitlements-treatments-cancelled-s1-confirmation')
  }
  else {
    res.redirect('s1-entitlements-treatments-cancelled-s1-confirmation')
  }

})

//dl1609-posted.html
router.post('/dl1609-posted', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-case-history-form-dl1609-complete')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-case-history-form-dl1609')
  }
  else {
    res.redirect('s1-has-dl1609-been-posted')
  }

})

//s071-posted.html
router.post('/s071-posted', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-case-history-form-s071-complete')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-case-history-form-s071')
  }
  else {
    res.redirect('s1-has-s071-been-posted')
  }

})

//fas1-posted.html
router.post('/fas1-posted', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-case-history-form-fas1-complete')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-case-history-form-fas1')
  }
  else {
    res.redirect('s1-has-fas1-been-posted')
  }

})

//s073-posted.html
router.post('/s073-posted', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-case-history-form-s073-complete')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-case-history-form-s073')
  }
  else {
    res.redirect('s1-has-s073-been-posted')
  }

})

//version-25/v3/s1-add-new-entitlement.html
router.post('/entitlement-type-s1', function (req, res) {

  const selectedRadio = req.body.entitlementType; 

  if (selectedRadio === "S2/E112"){
    res.redirect('s1-add-new-entitlement')
  }

  if (selectedRadio === "PRC"){
    res.redirect('s1-add-new-entitlement')
  }

  if (selectedRadio === "S1"){
    res.redirect('s1-select-s1-or-fas1-action')
  }

  else {
    res.redirect('s1-add-new-entitlement')
  }

})

//version-25/v3/s1-select-fas1-or-s1-action.html
router.post('/select-s1-or-fas1', function (req, res) {

  const selectedRadio = req.body.actionType; 

  if (selectedRadio === "S1"){
    res.redirect('s1-select-action')
  }

  if (selectedRadio === "FAS1"){
    res.redirect('s1-search-person')
  }

  else {
    res.redirect('s1-select-s1-or-fas1-action')
  }

})

//version-25/v3/prefilled-fas1-received-v3.html
router.post('/prefilled-fas1-received-v3', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-fas1-details')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-print-fas1-instructions')
  }
  else {
    res.redirect('s1-prefilled-fas1-received-v3')
  }

  })

  //version-25/v3/fas1-posted-v3.html
router.post('/fas1-posted-v3', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-case-history-form-fas1-complete')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-case-history-form-fas1')
  }
  else {
    res.redirect('s1-has-fas1-been-posted')
  }

})


//version-25/v3/s071-posted-v3.html
router.post('/s071-posted-v3', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-case-history-form-s071-complete')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-case-history-form-s071')
  }
  else {
    res.redirect('s1-has-s071-been-posted')
  }

})

//select-source.html
router.post('/select-source', function (req, res) {

  const selectedRadio = req.body.entitlement;

  if (selectedRadio === "Member state"){
    res.redirect('s1-prefilled-fas1-received-v4')
  }
  if (selectedRadio === "Individual"){
    res.redirect('s1-prefilled-fas1-received-v4')
  }
  if (selectedRadio === "DWP"){
    res.redirect('s1-prefilled-fas1-received-v4')
  }
  if (selectedRadio === "Overseas visitor manager"){
    res.redirect('s1-prefilled-fas1-received-v4')
  }
  if (selectedRadio === "GP"){
    res.redirect('s1-prefilled-fas1-received-v4')
  }
  else {
    res.redirect('s1-prefilled-fas1-received-v4')
  }

})


//select-action-criteria.html
router.post('/select-action-criteria', function (req, res) {

  const selectedRadio = req.body.entitlement;

  if (selectedRadio === "Yes"){
    res.redirect('s1-fas1-check-your-answers')
  }
  if (selectedRadio === "No"){
    res.redirect('s1-reason-for-rejection')
  }
  else {
    res.redirect('s1-fas1-does-person-meet-criteria')
  }

})

//version-25/v3/prefilled-fas1-received-v4.html
router.post('/prefilled-fas1-received-v4', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-fas1-details')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-contact-method-question')
  }
  else {
    res.redirect('s1-prefilled-fas1-received-v4')
  }

  })

//version-25/v3/contact-method-question.html
router.post('/contact-method-question', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "Email"){
    res.redirect('s1-send-email-instructions')
  }
  if (selectedRadio === "Post"){
    res.redirect('s1-print-fas1-instructions')
  }
  else {
    res.redirect('s1-contact-method-question')
  }

  })


//version-25/v3/prefilled-s072-received.html
router.post('/prefilled-s072-received', function (req, res) {

  const selectedRadio = req.body.status;

  if (selectedRadio === "yes"){
    res.redirect('s1-details')
  }
  if (selectedRadio === "no"){
    res.redirect('s1-prefilled-s072-received')
  }
  else {
    res.redirect('s1-prefilled-s072-received')
  }

  })


//select-s072-action-criteria.html
router.post('/select-s072-action-criteria', function (req, res) {

  const selectedRadio = req.body.entitlement;

  if (selectedRadio === "Yes"){
    res.redirect('s1-check-your-s1-answers')
  }
  if (selectedRadio === "No"){
    res.redirect('s1-reason-for-s1-rejection')
  }
  else {
    res.redirect('s1-s072-does-person-meet-criteria')
  }

})

module.exports = router;
