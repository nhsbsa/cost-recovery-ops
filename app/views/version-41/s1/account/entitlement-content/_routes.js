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

router.post([/change-pin-s1/], function (req, res) {
  req.session.data['new-pin'] = req.body['new-pin'];
  res.redirect('/version-41/s1/account/entitlement-content/change-pin-s1-cya');
});

// CYA for date of UK residency
router.get('/version-41/s1/account/entitlement-content/change-pin-s1-cya', function (req, res) {
  res.render('version-41/s1/account/entitlement-content/change-pin-s1-cya', { data: req.session.data });
});

router.post([/change-pin-s1-cya/], function (req, res) {
  req.session.data['change-pin'] = 'yes';
  res.redirect('/version-41/s1/account/entitlement-content/s1-entitlement-details');
});


// =====================================================
// Change the date of UK residency
// =====================================================

router.post([/change-date-of-residency-uk-s1/], function (req, res) {
  req.session.data['change-date-of-residency-uk'] = 'yes';
  req.session.data['new-date-of-residency-uk'] = req.body['new-date-of-residency-uk'];
  res.redirect('/version-41/s1/account/entitlement-content/change-date-of-residency-uk-s1-cya');
});

// CYA for date of UK residency
router.get('/version-41/s1/account/entitlement-content/change-date-of-residency-uk-s1-cya', function (req, res) {
  res.render('version-41/s1/account/entitlement-content/change-date-of-residency-uk-s1-cya', { data: req.session.data });
});

router.post([/change-date-of-residency-uk-s1-cya/], function (req, res) {
  req.session.data['uk-residency-change-comment'] = req.body['uk-residency-change-comment'];
  req.session.data['current-uk-residency-date'] = req.session.data['new-uk-residency-date'];
  const caseHistoryEntry = {
    action: 'Date of UK residency changed',
    details: {
      oldUKResidencyDate: req.session.data['previous-uk-residency-date'],
      newUKResidencyDate: req.session.data['current-uk-residency-date'],
      comment: req.session.data['uk-residency-date-change-comment']
    },
    timestamp: new Date().toISOString()
  };
  req.session.data['case-history-entitlements'] = req.session.data['case-history-entitlements'] || [];
  req.session.data['case-history-entitlements'].push(caseHistoryEntry);
  res.redirect('/version-41/s1/account/entitlement-content/s1-entitlement-details');
});

// View case history section
router.get('/version-41/s1/account/case-history-entitlements', function (req, res) {
  res.render('version-41/s1/account/case-history-entitlements', {
    history: req.session.data['case-history-entitlements']
  });
});

// =====================================================
// Change names
// =====================================================
router.post([/change-s1-names/], function(req, res){
  req.session.data['new-s1-first-names'] = req.body['new-s1-first-names'];
  req.session.data['new-s1-birth-first-names'] = req.body['new-s1-birth-first-names'];
  req.session.data['new-s1-last-name'] = req.body['new-s1-last-name'];
  req.session.data['new-s1-birth-last-names'] = req.body['new-s1-birth-last-name'];

  res.redirect('/version-41/s1/account/entitlement-content/reason-for-changing-s1-names');
});

router.post([/reason-for-changing-s1-names/], function(req, res){
  req.session.data['reason-for-changing-s1-names'] = req.body['reason-for-changing-s1-names'];
  res.redirect('/version-41/s1/account/entitlement-content/change-s1-names-cya');
});

// GET CYA page for changing names
router.get('/version-41/s1/account/entitlement-content/change-s1-names-cya', function (req, res) {
  res.render('version-41/s1/account/entitlement-content/change-s1-names-cya', { data: req.session.data });
});

router.post([/change-s1-names-cya/], function(req, res){
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
