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

  // Initialize resubmissions data if not already present
  if (!data.resubmissions) {
    data.resubmissions = {
      "1160158": {
        status: "peer-review-requested",
        invoiceStatuses: { Jane: "", John: "" },
        dhDateEntered: "",
        msDateEntered: ""
      },
      "7790992": {
        status: "invoices-added-to-resub",
        invoiceStatuses: {},
        dhDateEntered: "",
        msDateEntered: ""
      }
    };
  }

  res.redirect('/version-41/uk-claims/uk-claims-search-results');
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
  res.redirect('/version-41/uk-claims/uk-claims-search-results-found');
})

// Search for UK Claims - Average cost
router.post([/uk-claims-search-by-id/], function(req, res) {
  // Capture form data from the POST request
  const searchEntitlementID = req.body['search-entitlement-id'];
  
  // Store these in the session or database
  req.session.data['search-entitlement-id'] = searchEntitlementID;

  res.redirect('/version-41/uk-claims/uk-claims-search-by-id-results');
})

// Select type of S1 entitlement
router.get([/create-new-uk-claim/], function(req, res) {
  // Retrieve stored search entitlement data (if available)
  const searchEntitlementArticleType = req.session.data['search-entitlement-article-type'] || "";

  res.render('version-41/uk-claims/create-new-uk-claim', {
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
    return res.redirect('/version-41/uk-claims/create-new-uk-claim');
  } else {
    // Clear errors
    req.session.data['duplicateClaimError'] = null;
    req.session.data['supplementalClaimError'] = null;
    return res.redirect('/version-41/uk-claims/check-claim-details');
  }
});

// Check claim details
router.get([/check-claim-details/], function(req, res) {
  res.render('version-41/uk-claims/check-claim-details', {
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
  res.redirect('/version-41/uk-claims/uk-claims-loading-new-claim');
})

// Claim loading
router.post([/uk-claims-loading-new-claim/], function(req, res) {
  const entitlementArticleType = req.session.data['entitlement-article-type'];

  if (entitlementArticleType === 'EHIC and PRC - Article 62' || entitlementArticleType === "S2/E112 - Article 20.2") {
    res.redirect('/version-41/uk-claims/s1-claim-forms');
  } else {
   res.redirect('/version-41/uk-claims/s1-claim-summary');
  }
});

// Save details on claim summary and pass through to Claim history //
// Enter details of the claim
router.post([/s1-claim-summary/], function(req, res) {
  // Date claim sent to MS
  const dateClaimSentDay = req.body['date-claim-sent-day'];
  const dateClaimSentMonth = req.body['date-claim-sent-month'];
  const dateClaimSentYear = req.body['date-claim-sent-year'];
  const dateClaimSent = dateClaimSentDay && dateClaimSentMonth && dateClaimSentYear
    ? `${dateClaimSentDay}/${dateClaimSentMonth}/${dateClaimSentYear}`
    : '11/04/2025';
  req.session.data['date-claim-sent'] = dateClaimSent;

  // Date Member State received the claim
  const dateDocsReceivedByMSDay = req.body['date-claim-documents-received-by-ms-day'];
  const dateDocsReceivedByMSMonth = req.body['date-claim-documents-received-by-ms-month'];
  const dateDocsReceivedByMSYear = req.body['date-claim-documents-received-by-ms-year'];
  const dateClaimDocumentsReceivedByMS = dateDocsReceivedByMSDay && dateDocsReceivedByMSMonth && dateDocsReceivedByMSYear
    ? `${dateDocsReceivedByMSDay}/${dateDocsReceivedByMSMonth}/${dateDocsReceivedByMSYear}`
    : '18/04/2025';
  req.session.data['date-claim-documents-received-by-ms'] = dateClaimDocumentsReceivedByMS;

  // Date S100 uploaded to DH eXchange
  const dateS100GlobalNoteUploadedDay = req.body['date-s100-global-note-uploaded-day'];
  const dateS100GlobalNoteUploadedMonth = req.body['date-s100-global-note-uploaded-month'];
  const dateS100GlobalNoteUploadedYear = req.body['date-s100-global-note-uploaded-year'];
  const dateS100GlobalNoteUploaded = dateS100GlobalNoteUploadedDay && dateS100GlobalNoteUploadedMonth && dateS100GlobalNoteUploadedYear
    ? `${dateS100GlobalNoteUploadedDay}/${dateS100GlobalNoteUploadedMonth}/${dateS100GlobalNoteUploadedYear}`
    : '11/04/2025';
  req.session.data['date-s100-global-note-uploaded'] = dateS100GlobalNoteUploaded;

  // Date claim documents delivered to the MS
  const dateClaimDocumentsDeliveredToMSDay = req.body['date-claim-documents-delivered-to-ms-day'];
  const dateClaimDocumentsDeliveredToMSMonth = req.body['date-claim-documents-delivered-to-ms-month'];
  const dateClaimDocumentsDeliveredToMSYear = req.body['date-claim-documents-delivered-to-ms-year'];
  const dateClaimDocumentsDeliveredToMS = dateClaimDocumentsDeliveredToMSDay && dateClaimDocumentsDeliveredToMSMonth && dateClaimDocumentsDeliveredToMSYear
    ? `${dateClaimDocumentsDeliveredToMSDay}/${dateClaimDocumentsDeliveredToMSMonth}/${dateClaimDocumentsDeliveredToMSYear}`
    : '11/04/2025';
  req.session.data['date-claim-documents-delivered-to-ms'] = dateClaimDocumentsDeliveredToMS;

    // Date claim documents acknowledged by the MS
    const dateClaimDocumentsAcknowledgedByMSDay = req.body['date-claim-documents-acknowledged-by-ms-day'];
    const dateClaimDocumentsAcknowledgedByMSMonth = req.body['date-claim-documents-acknowledged-by-ms-month'];
    const dateClaimDocumentsAcknowledgedByMSYear = req.body['date-claim-documents-acknowledged-by-ms-year'];
    const dateClaimDocumentsAcknowledgedByMS = dateClaimDocumentsAcknowledgedByMSDay && dateClaimDocumentsAcknowledgedByMSMonth && dateClaimDocumentsAcknowledgedByMSYear
      ? `${dateClaimDocumentsAcknowledgedByMSDay}/${dateClaimDocumentsAcknowledgedByMSMonth}/${dateClaimDocumentsAcknowledgedByMSYear}`
      : '13/04/2025';
    req.session.data['date-claim-documents-acknowledged-by-ms'] = dateClaimDocumentsAcknowledgedByMS;

  // Store other form fields
  req.session.data['claim-sent-to-ms-by'] = req.body['claim-sent-to-ms-by'];
  req.session.data['s100-uploaded-by'] = req.body['s100-uploaded-by'];
  req.session.data['claim-sent-by'] = req.body['claim-sent-by'];
  req.session.data['rina-claim-rina-ref-no'] = req.body['rina-claim-rina-ref-no'];

  // Conditional flag to track claim summary details updated
  req.session.data['claim-summary-details-updated'] = 'yes';

  // Conditional flag to track if the date the claim documents were delivered to the MS has been updated
  req.session.data['date-claim-documents-delivered-to-ms-updated'] = 'yes';

  // Conditional flag to track if the date the claim documents were acknowledged by the MS has been updated
  req.session.data['date-claim-documents-acknowledged-by-ms-updated'] = 'yes';



  // Push data through to Claim history screen
  res.redirect('/version-41/uk-claims/s1-claim-history');
});

// Pull through the input data onto the Claim history screen
router.get([/s1-claim-history/], function(req, res) {
  res.render('version-41/uk-claims/s1-claim-history', {
    data: req.session.data
  });
});


module.exports = router;