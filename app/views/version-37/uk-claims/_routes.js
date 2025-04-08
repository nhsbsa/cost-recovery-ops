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

  res.redirect('/version-37/uk-claims/uk-claims-search-results');
})

// Search for UK Claims - Average cost
router.post(['/uk-claims-search-average-cost/'], function(req, res) {
  // Capture form data from the POST request
  const searchEntitlementArticleType = req.body['search-entitlement-article-type'];
  const searchYearOfClaim = req.body['search-year-of-claim'];  // Capture Year
  const searchEntitlementCountry = req.body['entitlement-country'];  // Capture Country

  // Store these in the session
  req.session.data['search-entitlement-article-type'] = searchEntitlementArticleType;
  req.session.data['search-year-of-claim'] = searchYearOfClaim;
  req.session.data['search-entitlement-country'] = searchEntitlementCountry;

  console.log("Session Data:", req.session.data);  // Debugging line

  // Redirect to search results page
  res.redirect('/version-37/uk-claims/uk-claims-search-results-found');
})

// Search for UK Claims - Average cost
router.post([/uk-claims-search-by-id/], function(req, res) {
  // Capture form data from the POST request
  const searchEntitlementID = req.body['search-entitlement-id'];
  
  // Store these in the session or database
  req.session.data['search-entitlement-id'] = searchEntitlementID;

  res.redirect('/version-37/uk-claims/uk-claims-search-by-id-results');
})

// Select type of S1 entitlement
router.get([/create-new-uk-claim/], function(req, res) {
  // Retrieve stored search entitlement data (if available)
  const searchEntitlementArticleType = req.session.data['search-entitlement-article-type'] || "";

  res.render('version-37/uk-claims/create-new-uk-claim', {
    searchEntitlementArticleType: searchEntitlementArticleType
  });
})

router.post([/create-new-uk-claim/], function(req, res) {
  // Capture data from the form
  const entitlementArticleType = req.body['entitlement-article-type'];
  const claimType = req.body['claim-type'];
  const claimAgeBracket = req.body['claim-age-bracket'];

  // Also pull from session if already stored
  const yearOfClaim = req.session.data['year-of-claim'];
  const entitlementCountry = req.session.data['entitlement-country'];

  // Store updated values in session
  req.session.data['entitlement-article-type'] = entitlementArticleType;
  req.session.data['claim-type'] = claimType;
  req.session.data['claim-age-bracket'] = claimAgeBracket;

  // Error 1: Duplicate Main Claim
  const isDuplicateClaim = 
    yearOfClaim === '2024' &&
    entitlementArticleType === 'S1/S072 - Article 63, 2.a' &&
    claimType === 'Main' &&
    claimAgeBracket === '0 to 19 years' &&
    entitlementCountry === 'France (FR)'

  if (isDuplicateClaim) {
    req.session.data['duplicateClaimError'] = 'You cannot create a Main claim for France in 2024 for ages 0 to 19 under Article 63 2.a.';
    req.session.data['supplementalClaimError'] = null;
    return res.redirect('/version-37/uk-claims/create-new-uk-claim');
  } else {
    // Clear errors
    req.session.data['duplicateClaimError'] = null;
    req.session.data['supplementalClaimError'] = null;
    return res.redirect('/version-37/uk-claims/check-claim-details');
  }
});

// Check claim details
router.get([/check-claim-details/], function(req, res) {
  res.render('version-37/uk-claims/check-claim-details', {
    yearOfClaim: req.session.data['year-of-claim'],
    entitlementArticleType: req.session.data['entitlement-article-type'],
    claimType: req.session.data['claim-type'],
    claimAgeBracket: req.session.data['claim-age-bracket'],
    entitlementCountry: req.session.data['entitlement-country'],
  });
})

// Check claim details
router.post([/check-claim-details/], function(req, res) {

  // Redirect to Loading claim page
  res.redirect('/version-37/uk-claims/uk-claims-loading-new-claim');
})

// Claim loading
router.post([/uk-claims-loading-new-claim/], function(req, res) {
  const entitlementArticleType = req.session.data['entitlement-article-type'];

  if (entitlementArticleType === 'EHIC and PRC - Article 62' || entitlementArticleType === "S2/E112 - Article 20.2") {
    res.redirect('/version-37/uk-claims/s1-claim-forms');
  } else {
   res.redirect('/version-37/uk-claims/s1-claim-summary');
  }
});


// Create new resubmission
router.post([/create-new-resubmission/], function(req, res) {
  // Date contestation received
  const receivedDay = req.body['date-contestation-received-day'];
  const receivedMonth = req.body['date-contestation-received-month'];
  const receivedYear = req.body['date-contestation-received-year'];
  const dateContestationReceived = receivedDay && receivedMonth && receivedYear
    ? `${receivedDay}/${receivedMonth}/${receivedYear}`
    : '12/03/2025';
  req.session.data['date-contestation-received'] = dateContestationReceived;

  // Date on contestation letter
  const letterDay = req.body['date-on-contestation-letter-day'];
  const letterMonth = req.body['date-on-contestation-letter-month'];
  const letterYear = req.body['date-on-contestation-letter-year'];
  const dateOnContestationLetter = letterDay && letterMonth && letterYear
    ? `${letterDay}/${letterMonth}/${letterYear}`
    : '12/03/2025';
  req.session.data['date-on-contestation-letter'] = dateOnContestationLetter;

  // Store other form fields
  req.session.data['number-of-contested-invoices'] = req.body['number-of-contested-invoices'];
  req.session.data['number-of-contested-months'] = req.body['number-of-contested-months'];
  req.session.data['member-state-reference'] = req.body['member-state-reference'];

  // Conditional flag to track resubmission
  req.session.data['create-new-resub'] = 'yes';

  // Redirect to next screen
  res.redirect('/version-37/uk-claims/resubmissions/confirmation-resubmission-created');
});

// Update claim resubmissions page with newly created resub
router.get('/version-37/uk-claims/resubmissions/claim-resubmissions', function(req, res) {
  
  // Optional: handle query param version if someone uses ?create-new-resub=yes
  if (req.query['create-new-resub']) {
    req.session.data['create-new-resub'] = req.query['create-new-resub'];
  }

  // Render the page and pass session data to Nunjucks
  res.render('version-37/uk-claims/resubmissions/claim-resubmissions', {
    data: req.session.data
  });
});


module.exports = router;