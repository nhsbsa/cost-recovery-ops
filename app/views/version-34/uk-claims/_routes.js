// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// S1 Claims //

// Search for UK Claims
router.post([/uk-claims-search/], function(req, res) {
  // Capture form data from the POST request
  const searchEntitlementArticleType = req.body['search-entitlement-article-type'];
  
  // Store these in the session or database
  req.session.data['search-entitlement-article-type'] = searchEntitlementArticleType;

  res.redirect('/version-34/uk-claims/uk-claims-search-results');
})

// Select type of S1 entitlement
router.get([/create-new-uk-claim/], function(req, res) {
  // Retrieve stored search entitlement data (if available)
  const searchEntitlementArticleType = req.session.data['search-entitlement-article-type'] || "";

  res.render('version-34/uk-claims/create-new-uk-claim', {
    searchEntitlementArticleType: searchEntitlementArticleType
  });
})

// Select type of S1 entitlement
router.post([/create-new-uk-claim/], function(req, res) {
// Capture data from the form
const entitlementArticleType = req.body['entitlement-article-type'] || req.session.data['search-entitlement-article-type'];
const claimSentBy = req.body['claim-sent-by'];

// Store updated values in session
req.session.data['entitlement-article-type'] = entitlementArticleType;
req.session.data['claim-sent-by'] = claimSentBy;

res.redirect('/version-34/uk-claims/check-claim-details');
})

// Check claim details
router.post([/check-claim-details/], function(req, res) {
  res.redirect('/version-34/uk-claims/uk-claims-loading-new-claim');
})

// Claim loading
router.post([/uk-claims-loading-new-claim/], function(req, res) {
  const articleType = req.session.data['search-entitlement-article-type'];

  if (articleType === 'EHIC and PRC - Article 62' || articleType === "S2/E112 - Article 20.2") {
    res.redirect('/version-34/uk-claims/s1-claim-forms');
  } else {
   res.redirect('/version-34/uk-claims/s1-claim-summary');
  }
});

module.exports = router;