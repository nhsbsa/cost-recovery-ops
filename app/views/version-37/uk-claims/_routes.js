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

  // Store other form fields
  req.session.data['claim-sent-to-ms-by'] = req.body['claim-sent-to-ms-by'];
  req.session.data['s100-uploaded-by'] = req.body['s100-uploaded-by'];
  req.session.data['claim-sent-by'] = req.body['claim-sent-by'];
  req.session.data['rina-claim-rina-ref-no'] = req.body['rina-claim-rina-ref-no'];

  // Conditional flag to track claim summary details updated
  req.session.data['claim-summary-details-updated'] = 'yes';

  // Push data through to Claim history screen
  res.redirect('/version-37/uk-claims/s1-claim-history');
});

// Pull through the input data onto the Claim history screen
router.get([/s1-claim-history/], function(req, res) {
  res.render('version-37/uk-claims/s1-claim-history', {
    data: req.session.data
  });
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


// Confirm selected invoices are added to resubmission
router.post([/check-invoices-added-to-resubmission/], function(req, res) {
  // Update session to reflect that invoices are added
  req.session.data['add-selected-invoices-to-resubmission'] = 'yes';

  // Redirect to the resubmission page
  res.redirect('/version-37/uk-claims/resubmissions/claim-resubmissions');
});


// Get the claim resubmissions page
router.get([/claim-resubmissions/], function(req, res) {
   // Check if resubmission creation or invoice addition flags are set
  if (req.query['create-new-resub']) {
    req.session.data['create-new-resub'] = req.query['create-new-resub'];
  }

  // Render the page with updated session data
  res.render('version-37/uk-claims/resubmissions/claim-resubmissions', {
    data: req.session.data
  });
});


// Partially maintain and partially withdraw journey //
// Get the partially maintained and partially withdrawn months
router.post([/partially-maintain-and-partially-withdraw-months/], function(req, res) {

  // Start date of first maintained month date
  const startMaintainedMonthDateDay = req.body['start-date-first-maintained-month-day'];
  const startMaintainedMonthDateMonth = req.body['start-date-first-maintained-month-month'];
  const startMaintainedMonthDateYear = req.body['start-date-first-maintained-month-year'];
  const startDateFirstMaintainedMonthDate = startMaintainedMonthDateDay && startMaintainedMonthDateMonth && startMaintainedMonthDateYear
    ? `${startMaintainedMonthDateDay}/${startMaintainedMonthDateMonth}/${startMaintainedMonthDateYear}`
    : '01/01/2025';
  req.session.data['start-date-first-maintained-month-date'] = startDateFirstMaintainedMonthDate;

  // End date of last maintained month date
  const endMaintainedMonthDateDay = req.body['end-date-last-maintained-month-day'];
  const endMaintainedMonthDateMonth = req.body['end-date-last-maintained-month-month'];
  const endMaintainedMonthDateYear = req.body['end-date-last-maintained-month-year'];
  const endDateLastMaintainedMonthDate = endMaintainedMonthDateDay && endMaintainedMonthDateMonth && endMaintainedMonthDateYear
    ? `${endMaintainedMonthDateDay}/${endMaintainedMonthDateMonth}/${endMaintainedMonthDateYear}`
    : '31/01/2025';
  req.session.data['end-date-last-maintained-month-date'] = endDateLastMaintainedMonthDate;

  // Redirect to the confirm partial
  res.redirect('/version-37/uk-claims/resubmissions/confirm-partially-maintained-and-partially-withdrawn-months');
});

// Confirm the partially maintained and partially withdrawn months by entering the total months for each
router.post([/confirm-partially-maintained-and-partially-withdrawn-months/], function(req, res) {

  // Store the total amount of maintained months
  const totalMaintainedMonths = req.body['total-maintained-months'];
  req.session.data['total-maintained-months'] = totalMaintainedMonths;

  // Store the total amount of withdrawn months
  const totalWithdrawnMonths = req.body['total-withdrawn-months'];
  req.session.data['total-withdrawn-months'] = totalWithdrawnMonths;

  // Redirect to select the reasons of the partial maintain
  res.redirect('/version-37/uk-claims/resubmissions/reasons-to-partially-maintain-months');
});

// Select the reasons to partially maintain the months
router.post([/reasons-to-partially-maintain-months/], function(req, res) {

  // Store the reasons for partially maintaining months
  const reasonToPartiallyMaintainMonths = req.body['reasons-to-partially-maintain-months'];
  req.session.data['reasons-to-partially-maintain-months'] = reasonToPartiallyMaintainMonths;

  // Store the date the contestation was received (after deadline)
  const dateContestationReceivedAfterDeadlineDayPartiallyMaintain = req.body['date-contestation-received-after-deadline-day-partially-maintain'];
  const dateContestationReceivedAfterDeadlineMonthPartiallyMaintain = req.body['date-contestation-received-after-deadline-month-partially-maintain'];
  const dateContestationReceivedAfterDeadlineYearPartiallyMaintain = req.body['date-contestation-received-after-deadline-year-partially-maintain'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateContestationReceivedAfterDeadlinePartiallyMaintain = dateContestationReceivedAfterDeadlineDayPartiallyMaintain && dateContestationReceivedAfterDeadlineMonthPartiallyMaintain && dateContestationReceivedAfterDeadlineYearPartiallyMaintain 
  ? `${dateContestationReceivedAfterDeadlineDayPartiallyMaintain}/${dateContestationReceivedAfterDeadlineMonthPartiallyMaintain}/${dateContestationReceivedAfterDeadlineYearPartiallyMaintain}` 
  : '17/04/2026';
  req.session.data['date-contestation-received-after-deadline-partially-maintain'] = dateContestationReceivedAfterDeadlinePartiallyMaintain;


  // Store the date the state pension was received
  const dateStatePensionReceivedDayPartiallyMaintain = req.body['date-state-pension-received-day-partially-maintain'];
  const dateStatePensionReceivedMonthPartiallyMaintain = req.body['date-state-pension-received-month-partially-maintain'];
  const dateStatePensionReceivedYearPartiallyMaintain = req.body['date-state-pension-received-year-partially-maintain'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateStatePensionReceivedPartiallyMaintain = dateStatePensionReceivedDayPartiallyMaintain && dateStatePensionReceivedMonthPartiallyMaintain && dateStatePensionReceivedYearPartiallyMaintain 
  ? `${dateStatePensionReceivedDayPartiallyMaintain}/${dateStatePensionReceivedMonthPartiallyMaintain}/${dateStatePensionReceivedYearPartiallyMaintain}` 
  : '17/04/2024';
  req.session.data['date-state-pension-received-partially-maintain'] = dateStatePensionReceivedPartiallyMaintain;

  // Redirect to select the source of the partial withdrawal request
  res.redirect('/version-37/uk-claims/resubmissions/source-of-partial-withdrawal');
});


// Who made the request to partially withdraw?
router.post([/source-of-partial-withdrawal/], function(req, res) {

  // Store the source of the partial withdrawal request
  const sourceOfPartialWithdrawal = req.body['partial-withdrawal-source'];
  req.session.data['partial-withdrawal-source'] = sourceOfPartialWithdrawal;

  // Redirect to select the reasons for partially withdrawing months claimed
  res.redirect('/version-37/uk-claims/resubmissions/reasons-to-partially-withdraw-months');
});


// Select the reasons to partially withdraw the months
router.post([/reasons-to-partially-withdraw-months/], function(req, res) {

  // Store the reasons for partially withdrawing months
  const reasonToPartiallyWithdrawMonths = req.body['reasons-to-partially-withdraw-months'];
  req.session.data['reasons-to-partially-withdraw-months'] = reasonToPartiallyWithdrawMonths;

  // Store the date the contestation was received (after deadline)
  const dateContestationReceivedAfterDeadlineDayPartiallyWithdraw = req.body['date-contestation-received-after-deadline-day-partially-withdraw'];
  const dateContestationReceivedAfterDeadlineMonthPartiallyWithdraw = req.body['date-contestation-received-after-deadline-month-partially-withdraw'];
  const dateContestationReceivedAfterDeadlineYearPartiallyWithdraw = req.body['date-contestation-received-after-deadline-year-partially-withdraw'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateContestationReceivedAfterDeadlinePartiallyWithdraw = dateContestationReceivedAfterDeadlineDayPartiallyWithdraw && dateContestationReceivedAfterDeadlineMonthPartiallyWithdraw && dateContestationReceivedAfterDeadlineYearPartiallyWithdraw
  ? `${dateContestationReceivedAfterDeadlineDayPartiallyWithdraw}/${dateContestationReceivedAfterDeadlineMonthPartiallyWithdraw}/${dateContestationReceivedAfterDeadlineYearPartiallyWithdraw}` 
  : '17/04/2026';
  req.session.data['date-contestation-received-after-deadline-partially-withdraw'] = dateContestationReceivedAfterDeadlinePartiallyWithdraw;


  // Store the date the state pension was received
  const dateStatePensionReceivedDayPartiallyWithdraw = req.body['date-state-pension-received-day-partially-withdraw'];
  const dateStatePensionReceivedMonthPartiallyWithdraw = req.body['date-state-pension-received-month-partially-withdraw'];
  const dateStatePensionReceivedYearPartiallyWithdraw = req.body['date-state-pension-received-year-partially-withdraw'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateStatePensionReceivedPartiallyWithdraw = dateStatePensionReceivedDayPartiallyWithdraw && dateStatePensionReceivedMonthPartiallyWithdraw && dateStatePensionReceivedYearPartiallyWithdraw
  ? `${dateStatePensionReceivedDayPartiallyWithdraw}/${dateStatePensionReceivedMonthPartiallyWithdraw}/${dateStatePensionReceivedYearPartiallyWithdraw}` 
  : '17/04/2024';
  req.session.data['date-state-pension-received-partially-withdraw'] = dateStatePensionReceivedPartiallyWithdraw;

  // Redirect to select the source of the partial withdrawal request
  res.redirect('/version-37/uk-claims/resubmissions/cya-partial-maintain-and-partial-withdraw');
});

// Pull through the input data onto the cya screen
router.get([/cya-partial-maintain-and-partial-withdraw/], function(req, res) {
  res.render('version-37/uk-claims/resubmissions/cya-partial-maintain-and-partial-withdraw', {
    data: req.session.data
  });
});

// Redirect cya to Invoices within the resubmission screen
router.post([/cya-partial-maintain-and-partial-withdraw/], function(req, res) {
  // Update session to reflect that the invoice status has been set to Partial
  req.session.data['set-invoice-to-partial'] = 'yes';

  // Redirect to the resubmission page
  res.redirect('/version-37/uk-claims/resubmissions/invoices-within-resubmission');
});


// Withdraw journey //
// Who made the request to withdraw?
router.post([/source-of-withdrawal/], function(req, res) {

  // Store the source of the withdrawal request
  const sourceOfWithdrawal = req.body['withdrawal-source'];
  req.session.data['withdrawal-source'] = sourceOfWithdrawal;

  // Redirect to select the reasons for withdrawing months claimed
  res.redirect('/version-37/uk-claims/resubmissions/reasons-to-withdraw-months');
});

// Select the reasons to withdraw the months
router.post([/reasons-to-withdraw-months/], function(req, res) {

  // Store the reasons for  withdrawing months
  const reasonToWithdrawMonths = req.body['reasons-to-withdraw-months'];
  req.session.data['reasons-to-withdraw-months'] = reasonToWithdrawMonths;

  // Store the date the contestation was received (after deadline)
  const dateContestationReceivedAfterDeadlineDayWithdraw = req.body['date-contestation-received-after-deadline-day-withdraw'];
  const dateContestationReceivedAfterDeadlineMonthWithdraw = req.body['date-contestation-received-after-deadline-month-withdraw'];
  const dateContestationReceivedAfterDeadlineYearWithdraw = req.body['date-contestation-received-after-deadline-year-withdraw'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateContestationReceivedAfterDeadlineWithdraw = dateContestationReceivedAfterDeadlineDayWithdraw && dateContestationReceivedAfterDeadlineMonthWithdraw && dateContestationReceivedAfterDeadlineYearWithdraw
  ? `${dateContestationReceivedAfterDeadlineDayWithdraw}/${dateContestationReceivedAfterDeadlineMonthWithdraw}/${dateContestationReceivedAfterDeadlineYearWithdraw}` 
  : '17/04/2026';
  req.session.data['date-contestation-received-after-deadline-withdraw'] = dateContestationReceivedAfterDeadlineWithdraw;


  // Store the date the state pension was received
  const dateStatePensionReceivedDayWithdraw = req.body['date-state-pension-received-day-withdraw'];
  const dateStatePensionReceivedMonthWithdraw = req.body['date-state-pension-received-month-withdraw'];
  const dateStatePensionReceivedYearWithdraw = req.body['date-state-pension-received-year-withdraw'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateStatePensionReceivedWithdraw = dateStatePensionReceivedDayWithdraw && dateStatePensionReceivedMonthWithdraw && dateStatePensionReceivedYearWithdraw
  ? `${dateStatePensionReceivedDayWithdraw}/${dateStatePensionReceivedMonthWithdraw}/${dateStatePensionReceivedYearWithdraw}` 
  : '17/04/2024';
  req.session.data['date-state-pension-received-withdraw'] = dateStatePensionReceivedWithdraw;

  // Redirect to select check your answers (Withdraw)
  res.redirect('/version-37/uk-claims/resubmissions/cya-withdraw');
});

// Pull through the input data onto the cya screen
router.get([/cya-withdraw/], function(req, res) {
  res.render('version-37/uk-claims/resubmissions/cya-withdraw', {
    data: req.session.data
  });
});

// Redirect cya to Invoices within the resubmission screen
router.post([/cya-withdraw/], function(req, res) {
  
  // Update session to reflect that the invoice status has been set to Withdrawn
  req.session.data['set-invoice-to-withdrawn'] = 'yes';

  // Redirect to the resubmission page
  res.redirect('/version-37/uk-claims/resubmissions/invoices-within-resubmission');
});


// Maintain journey //
// Select the reasons to  maintain the months
router.post([/reasons-to-maintain-months/], function(req, res) {

  // Store the reasons for maintaining months
  const reasonToMaintainMonths = req.body['reasons-to-maintain-months'];
  req.session.data['reasons-to-maintain-months'] = reasonToMaintainMonths;

  // Store the date the contestation was received (after deadline)
  const dateContestationReceivedAfterDeadlineDayMaintain = req.body['date-contestation-received-after-deadline-day-maintain'];
  const dateContestationReceivedAfterDeadlineMonthMaintain = req.body['date-contestation-received-after-deadline-month-maintain'];
  const dateContestationReceivedAfterDeadlineYearMaintain = req.body['date-contestation-received-after-deadline-year-maintain'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateContestationReceivedAfterDeadlineMaintain = dateContestationReceivedAfterDeadlineDayMaintain && dateContestationReceivedAfterDeadlineMonthMaintain && dateContestationReceivedAfterDeadlineYearMaintain 
  ? `${dateContestationReceivedAfterDeadlineDayMaintain}/${dateContestationReceivedAfterDeadlineMonthMaintain}/${dateContestationReceivedAfterDeadlineYearMaintain}` 
  : '17/04/2026';
  req.session.data['date-contestation-received-after-deadline-maintain'] = dateContestationReceivedAfterDeadlineMaintain;


  // Store the date the state pension was received
  const dateStatePensionReceivedDayMaintain = req.body['date-state-pension-received-day-maintain'];
  const dateStatePensionReceivedMonthMaintain = req.body['date-state-pension-received-month-maintain'];
  const dateStatePensionReceivedYearMaintain = req.body['date-state-pension-received-year-maintain'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateStatePensionReceivedMaintain = dateStatePensionReceivedDayMaintain && dateStatePensionReceivedMonthMaintain && dateStatePensionReceivedYearMaintain 
  ? `${dateStatePensionReceivedDayMaintain}/${dateStatePensionReceivedMonthMaintain}/${dateStatePensionReceivedYearMaintain}` 
  : '17/04/2024';
  req.session.data['date-state-pension-received-maintain'] = dateStatePensionReceivedMaintain;

  // Redirect to check your answers (maintain)
  res.redirect('/version-37/uk-claims/resubmissions/cya-maintain');
});

// Pull through the input data onto the cya screen
router.get([/cya-maintain/], function(req, res) {
  res.render('version-37/uk-claims/resubmissions/cya-maintain', {
    data: req.session.data
  });
});

// Redirect cya to Invoices within the resubmission screen
router.post([/cya-maintain/], function(req, res) {
  // Update session to reflect that the invoice status has been set to Maintained
  req.session.data['set-invoice-to-maintained'] = 'yes';

  // Redirect to the resubmission page
  res.redirect('/version-37/uk-claims/resubmissions/invoices-within-resubmission');
});

module.exports = router;