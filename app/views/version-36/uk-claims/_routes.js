// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// S1 Claims //

// Search for UK Claims - Actual cost
router.post([/uk-claims-search-actual-cost/], function(req, res) {
  // Capture form data from the POST request
  const searchEntitlementArticleType = req.body['search-entitlement-article-type'];
  
  // Store these in the session or database
  req.session.data['search-entitlement-article-type'] = searchEntitlementArticleType;

  res.redirect('/version-36/uk-claims/uk-claims-search-results');
})

// Search for UK Claims - Average cost
router.post([/uk-claims-search-average-cost/], function(req, res) {
  // Capture form data from the POST request
  const searchEntitlementArticleType = req.body['search-entitlement-article-type'];
  
  // Store these in the session or database
  req.session.data['search-entitlement-article-type'] = searchEntitlementArticleType;

  res.redirect('/version-36/uk-claims/uk-claims-search-results-found');
})

// Search for UK Claims - Average cost
router.post([/uk-claims-search-by-id/], function(req, res) {
  // Capture form data from the POST request
  const searchEntitlementID = req.body['search-entitlement-id'];
  
  // Store these in the session or database
  req.session.data['search-entitlement-id'] = searchEntitlementID;

  res.redirect('/version-36/uk-claims/uk-claims-search-by-id-results');
})

// Select type of S1 entitlement
router.get([/create-new-uk-claim/], function(req, res) {
  // Retrieve stored search entitlement data (if available)
  const searchEntitlementArticleType = req.session.data['search-entitlement-article-type'] || "";

  res.render('version-36/uk-claims/create-new-uk-claim', {
    searchEntitlementArticleType: searchEntitlementArticleType
  });
})

// Select type of S1 entitlement
router.post([/create-new-uk-claim/], function(req, res) {
// Capture data from the form
const entitlementArticleType = req.body['entitlement-article-type'] || req.session.data['entitlement-article-type'];
const claimType = req.body['claim-type'];
const claimAgeBracket = req.body['claim-age-bracket'];

// Store updated values in session
req.session.data['entitlement-article-type'] = entitlementArticleType;
req.session.data['claim-type'] = claimType;
req.session.data['claim-age-bracket'] = claimAgeBracket;

res.redirect('/version-36/uk-claims/check-claim-details');
})

// Check claim details
router.post([/check-claim-details/], function(req, res) {
  res.redirect('/version-36/uk-claims/uk-claims-loading-new-claim');
})

// Claim loading
router.post([/uk-claims-loading-new-claim/], function(req, res) {
  const entitlementArticleType = req.session.data['entitlement-article-type'];

  if (entitlementArticleType === 'EHIC and PRC - Article 62' || entitlementArticleType === "S2/E112 - Article 20.2") {
    res.redirect('/version-36/uk-claims/s1-claim-forms');
  } else {
   res.redirect('/version-36/uk-claims/s1-claim-summary');
  }
});

// Check and confirm selected invoices should be removed from the claim
router.post([/confirm-remove-invoices/], function(req, res) {

  req.session.data['remove-invoices-from-retroactive-claim'] = 'yes'

  res.redirect('/version-36/uk-claims/s1-claim-forms');
})

module.exports = router;