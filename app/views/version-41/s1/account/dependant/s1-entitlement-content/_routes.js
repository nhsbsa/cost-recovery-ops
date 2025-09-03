// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Link a Main Insured from the Dependant's record //

// Check you're linking to the correct Main insurer and S1/S072 entitlement
router.post([/dr-link-to-entitlement-cya/], function(req, res){

  req.session.data['dr-add-main'] = 'yes'
  req.session.data['add-dependant'] = 'yes'

  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
})

// How is the Dependant related to the Main Insured?
router.post([/dr-select-relationship/], function(req, res) {

  req.session.data['dr-add-main'] = 'yes'
  
  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});

// Change dependant relationship to Main Insured
router.post([/dr-change-relationship/], function(req, res) {

  req.session.data['dr-add-main'] = 'yes'

  req.session.data['dr-change-main-relationship'] = 'yes'

  // Save the new relationship temporarily in session data
  req.session.data['dr-new-relationship'] = req.body['dr-new-relationship'];
  
  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});


// =====================================================
// Changing S1 entitlement details
// =====================================================


// =====================================================
// Change names
// =====================================================
router.post([/dr-change-s1-names/], function(req, res){
  req.session.data['dr-new-s1-first-names'] = req.body['dr-new-s1-first-names'];
  req.session.data['dr-new-s1-birth-first-names'] = req.body['dr-new-s1-birth-first-names'];
  req.session.data['dr-new-s1-last-name'] = req.body['dr-new-s1-last-name'];
  req.session.data['dr-new-s1-birth-last-names'] = req.body['dr-new-s1-birth-last-name'];

  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/dr-reason-for-s1-name-change');
});

router.post([/dr-reason-for-s1-name-change/], function(req, res){
  req.session.data['dr-reason-for-changing-s1-names'] = req.body['dr-reason-for-changing-s1-names'];
  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/dr-check-before-changing-s1-names');
});


router.post([/dr-check-before-changing-s1-names/], function(req, res){
  req.session.data['dr-change-s1-names'] = 'yes';

  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});


// =====================================================
// Change the Personal identifcation number (PIN)
// =====================================================
// Step 1 - change the S1 entitlement PIN
router.post([/dr-change-pin-s1/], function (req, res) {
  req.session.data['dr-new-s1-pin'] = req.body['dr-new-s1-pin'];
  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/dr-reason-for-changing-s1-pin');
});

// Step 2 - Enter the reason for making a change to S1 entitlement PIN
router.post([/dr-reason-for-changing-s1-pin/], function(req, res){
  req.session.data['dr-reason-for-changing-s1-pin'] = req.body['dr-reason-for-changing-s1-pin'];
  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/dr-check-before-changing-s1-pin');
});

// Step 3 - Check your answers before changing the S1 entitlement PIN
router.post([/dr-check-before-changing-s1-pin/], function (req, res) {
  req.session.data['dr-change-s1-pin'] = 'yes';
  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});


// =====================================================
// Change the date of UK residency
// =====================================================
// Step 1 - Change the S1 entitlement date of UK residency
router.post([/dr-change-date-of-uk-residency-s1/], function (req, res) {
  // Store the new date of UK residency
  const day = req.body['dr-new-s1-uk-residency-day'];
  const month = req.body['dr-new-s1-uk-residency-month'];
  const year = req.body['dr-new-s1-uk-residency'];
  
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
    dateS1UKResidency = '28 September 2024';
  }
  req.session.data['dr-new-s1-uk-residency-date'] = dateS1UKResidency;

  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/dr-reason-for-changing-s1-date-of-uk-residency');
});

// Step 2 - Enter the reason for making a change to the date of UK residency
router.post([/dr-reason-for-changing-s1-date-of-uk-residency/], function(req, res){
  req.session.data['dr-reason-for-changing-s1-date-of-uk-residency'] = req.body['dr-reason-for-changing-s1-date-of-uk-residency'];
  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/dr-check-before-changing-s1-date-of-uk-residency');
});

// Step 3 - Check your answers before changing the S1 entitlement date of UK residency
router.post([/dr-check-before-changing-s1-date-of-uk-residency/], function (req, res) {
  req.session.data['dr-change-s1-date-of-uk-residency'] = 'yes';
  res.redirect('/version-41/s1/account/dependant/s1-entitlement-content/s1-entitlement-details');
});

module.exports = router;