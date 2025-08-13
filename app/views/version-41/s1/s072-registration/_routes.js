// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// S1/S072 entitlement registration (Main Insured record) //

// Select entitlement
router.post(/which-entitlement/, function(req, res){
  res.redirect('/version-41/s1/s072-registration/which-s1-entitlement');
})

// Select type of S1 entitlement
router.post([/which-s1-entitlement/], function(req, res) {
  var s1EntitlementType = req.session.data['s1-entitlement-type'];
  
  if (s1EntitlementType === 'E109') {
    res.redirect('/version-41/s1/s072-registration/entitlement-details');
  } else {
    res.redirect('/version-41/s1/s072-registration/entitlement-for');
  }
})


// Select who the entitlement is for
router.post([/entitlement-for/], function(req, res){
  res.redirect('/version-41/s1/s072-registration/entitlement-details');
})

// Select source
router.post([/which-source/], function(req, res) {
  // Capture form data from the POST request
  const sourceOfInformation = req.body['source-of-information'];
  const otherSourceOfInformationName = req.body['other-source-of-information-name'];

  // Store the data in the session object
  req.session.data = req.session.data || {}; // Initialize session data if not already present
  req.session.data['source-of-information'] = sourceOfInformation;

  // If 'Other' is selected, store the additional input field data
  if (sourceOfInformation === 'Other') {
    req.session.data['other-source-of-information-name'] = otherSourceOfInformationName;
  } else {
    // Clear previous "Other" field data if a different option is selected
    req.session.data['other-source-of-information-name'] = '';
  }

  // Redirect to the next step
  res.redirect('/version-41/s1/s072-registration/entitlement-details');
});

// Input entitlement details
router.post([/entitlement-details/], function(req, res){
  res.redirect('/version-41/s1/s072-registration/search-institution-ID');
})

// Search by institution ID (to show functionality)
router.post([/search-institution-ID/], function(req, res){
  res.redirect('/version-41/s1/s072-registration/institution-ID-search-results');
})

// Search by institution name (to show functionality)
router.post([/search-institution-name/], function(req, res){
  res.redirect('/version-41/s1/s072-registration/institution-name-search-results');
})

// Institution ID search results
router.post([/institution-ID-search-results/], function(req, res){
  res.redirect('/version-41/s1/s072-registration/new-s1-s073-entitlement-cya');
})

// Institution name search results
router.post([/institution-name-search-results/], function(req, res){
  res.redirect('/version-41/s1/s072-registration/new-s1-s073-entitlement-cya');
})

// Institution ID search results - not found (to show functionality)
router.post([/institution-ID-search-results-none/], function(req, res){
  res.redirect('/version-41/s1/s072-registration/add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/institution-name-search-results-none/], function(req, res){
  res.redirect('/version-41/s1/s072-registration/add-new-institution-details');
})

// Institution ID search results - not found (to show functionality)
router.post([/add-new-institution-details/], function(req, res){
  res.redirect('/version-41/s1/s072-registration/new-s1-s072-entitlement-cya');
})

// Check your answers
router.post([/new-s1-s072-entitlement-cya/], function(req, res){
  req.session.data['dr-add-s1-entitlement'] = 'yes'
  res.redirect('/version-41/s1/s072-registration/confirmation-s1-s072-added');
})


module.exports = router;