// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// =====================================================
// S1 entitlement content (Main insured record)
// =====================================================

// Link a Main Insured's S1 entitlement to a Dependant's S1 entitlement
router.post([/s1-dependant-personal-details/], function(req, res) {
  console.log(req.body.action);
  req.session.data['s1-add-dependant'] = 'yes';
  res.redirect('/version-41/s1/account/entitlement-content/s1-confirmation-dependant-added');
});

// Enter dependant's details
router.post([/s1-create-new-dependant-record/], function(req, res){
  res.redirect('add-dependant-address');
});

// Does the dependant live at the same address as the Main?
router.post([/add-dependant-address/], function(req, res) {
  const addDependantAddress = req.session.data['add-dependant-address'];
  if (addDependantAddress === 'yes'){
    res.redirect('/version-41/s1/account/entitlement-content/enter-dependant-address');
  } else {
    res.redirect('/version-41/s1/account/entitlement-content/s1-dependant-details-check');
  }
});

// Enter dependant's address
router.post([/enter-dependant-address/], function(req, res){
  res.redirect('s1-dependant-details-check');
});

// Check dependant's details
router.post([/s1-dependant-details-check/], function(req, res) {
  console.log(req.body.action);
  req.session.data['s1-add-dependant'] = 'yes';
  if (req.body.action === 'add') {
    res.redirect('/version-41/s1/account/entitlement-content/s1-create-new-dependant-record?number-of-dependants=2');
  } else {
    res.redirect('/version-41/s1/account/entitlement-content/s1-confirmation-dependant-added');
  }
});

// =====================================================
// Changing S1 entitlement details
// =====================================================

// =====================================================
// Change the Personal identifcation number (PIN)
// =====================================================
// Step 1 - change the S1 entitlement PIN
router.post([/change-pin-s1/], function (req, res) {
  req.session.data['new-s1-pin'] = req.body['new-s1-pin'];
  res.redirect('/version-41/s1/account/entitlement-content/reason-for-changing-s1-pin');
});

// Step 2 - Enter the reason for making a change to S1 entitlement PIN
router.post([/reason-for-changing-s1-pin/], function(req, res){
  req.session.data['reason-for-changing-s1-pin'] = req.body['reason-for-changing-s1-pin'];
  res.redirect('/version-41/s1/account/entitlement-content/check-before-changing-s1-pin');
});

// Step 3 - Check your answers before changing the S1 entitlement PIN
router.post([/check-before-changing-s1-pin/], function (req, res) {
  req.session.data['change-s1-pin'] = 'yes';
  res.redirect('/version-41/s1/account/entitlement-content/s1-entitlement-details');
});


// =====================================================
// Change the date of UK residency
// =====================================================
// Step 1 - Change the S1 entitlement date of UK residency
router.post([/change-date-of-uk-residency-s1/], function (req, res) {
  // Store the new date of UK residency
  const day = req.body['new-s1-uk-residency-day'];
  const month = req.body['new-s1-uk-residency-month'];
  const year = req.body['new-s1-uk-residency'];
  
  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let dateS1UKResidency;
  if (day && month && year) {
    const monthName = monthNames[parseInt(month, 10) - 1];
    dateS1UKResidency = `${parseInt(day, 10)} ${monthName} ${year}`;
  } else {
    dateS1UKResidency = '21 August 2024';
  }
  req.session.data['new-s1-uk-residency-date'] = dateS1UKResidency;

  res.redirect('/version-41/s1/account/entitlement-content/reason-for-changing-s1-date-of-uk-residency');
});

// Step 2 - Enter the reason for making a change to the date of UK residency
router.post([/reason-for-changing-s1-date-of-uk-residency/], function(req, res){
  req.session.data['reason-for-changing-s1-date-of-uk-residency'] = req.body['reason-for-changing-s1-date-of-uk-residency'];
  res.redirect('/version-41/s1/account/entitlement-content/check-before-changing-s1-date-of-uk-residency');
});

// Step 3 - Check your answers before changing the S1 entitlement date of UK residency
router.post([/check-before-changing-s1-date-of-uk-residency/], function (req, res) {
  req.session.data['change-s1-date-of-uk-residency'] = 'yes';
  res.redirect('/version-41/s1/account/entitlement-content/s1-entitlement-details');
});



// =====================================================
// Change names
// =====================================================
router.post([/change-s1-names/], function(req, res){
  req.session.data['new-s1-first-names'] = req.body['new-s1-first-names'];
  req.session.data['new-s1-birth-first-names'] = req.body['new-s1-birth-first-names'];
  req.session.data['new-s1-last-name'] = req.body['new-s1-last-name'];
  req.session.data['new-s1-birth-last-names'] = req.body['new-s1-birth-last-name'];

  res.redirect('/version-41/s1/account/entitlement-content/reason-for-s1-name-change');
});

router.post([/reason-for-s1-name-change/], function(req, res){
  req.session.data['reason-for-changing-s1-names'] = req.body['reason-for-changing-s1-names'];
  res.redirect('/version-41/s1/account/entitlement-content/check-before-changing-s1-names');
});


router.post([/check-before-changing-s1-names/], function(req, res){
  req.session.data['change-s1-names'] = 'yes';

  res.redirect('/version-41/s1/account/entitlement-content/s1-entitlement-details');
});



// =====================================================
// Change end date
// =====================================================
router.post([/change-s1-entitlement-end-date/], function(req, res){
  const day = req.body['updated-s1-entitlement-end-date-day'];
  const month = req.body['updated-s1-entitlement-end-date-month'];
  const year = req.body['updated-s1-entitlement-end-date-year'];
  const updatedS1EntitlementEndDate = day && month && year ? `${day}/${month}/${year}` : '17/03/2025';
  req.session.data['updated-s1-entitlement-end-date'] = updatedS1EntitlementEndDate;
  req.session.data['update-s1-entitlement-end-date'] = 'yes';
  res.redirect('/version-41/s1/account/entitlement-content/s1-entitlement-details');
});

// =====================================================
// GET route for entitlement details (final destination)
// =====================================================
router.get('/version-41/s1/account/entitlement-content/s1-entitlement-details', function (req, res) {
  res.render('version-41/s1/account/entitlement-content/s1-entitlement-details', { data: req.session.data });
});

// View case history section for entitlements
router.get('/version-41/s1/account/case-history-entitlements', function (req, res) {
  res.render('version-41/s1/account/case-history-entitlements', {
    history: req.session.data['case-history-entitlements']
  });
});

module.exports = router;
