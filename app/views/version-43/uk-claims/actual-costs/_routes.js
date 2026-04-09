// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Acutal Costs //

// Set treatment month values per person (used for claim-summary totals)
const treatmentMonths = {
  'Jane': 300.00
};

// Helper to check if all Treatments have a status set
function allTreatmentsHaveStatus(statuses, expectedCount) {
  return Object.keys(statuses).length === expectedCount &&
         Object.values(statuses).every(status => status !== '');
}


router.get([/resubmission-summary/], function(req, res) {
  const data = req.session.data;

  // === Status calculation logic
  const statuses = data.Treatmentstatuses || {};
  const treatmentList = ['Jane'];

  const allReviewed = Object.keys(statuses).length === treatmentList.length &&
                      Object.values(statuses).every(status => status !== '');

  const statusPriority = [
    'treatments-added-to-resub',
    'ready-to-send-for-peer-review',
    'peer-review-requested',
    'assigned-for-review',
    'peer-reviewed',
    'resubmission-sent-to-dh',
    'resubmission-completed'
  ];

  let currentStatus = data.resubStatus || '';
  let currentIndex = statusPriority.indexOf(currentStatus);

  if (!currentStatus || currentStatus === 'treatments-added-to-resub') {
    currentStatus = allReviewed ? 'ready-to-send-for-peer-review' : 'treatments-added-to-resub';
    currentIndex = statusPriority.indexOf(currentStatus);
  }

  const dhDate = data['date-resubmission-uploaded-to-dh-exchange'];
  const msDate = data['date-resubmission-sent-to-ms'];

  if (dhDate && msDate) {
    const completedIndex = statusPriority.indexOf('resubmission-completed');
    if (completedIndex > currentIndex) {
      currentStatus = 'resubmission-completed';
      currentIndex = completedIndex;
    }
  } else if (dhDate) {
    const dhIndex = statusPriority.indexOf('resubmission-sent-to-dh');
    if (dhIndex > currentIndex) {
      currentStatus = 'resubmission-sent-to-dh';
      currentIndex = dhIndex;
    }
  }

  if (allReviewed) {
    const reviewedIndex = statusPriority.indexOf('ready-to-send-for-peer-review');
    if (reviewedIndex > currentIndex) {
      currentStatus = 'ready-to-send-for-peer-review';
    }
  }

  data.resubStatus = currentStatus;

  // === Summary value calculation logic
  const treatmentMonthSplits = data.treatmentMonthSplits || {};
  let maintainedTreatments = 0;
  let withdrawnTreatments = 0;
  let maintainedMonths = 0;
  let withdrawnMonths = 0;

  for (const [treatment, split] of Object.entries(treatmentMonthSplits)) {
    const m = split.maintained || 0;
    const w = split.withdrawn || 0;

    maintainedMonths += m;
    withdrawnMonths += w;

    if (m > 0) maintainedTreatments += 1;
    if (w > 0) withdrawnTreatments += 1;
  }

  const showResubSummary = data.showResubSummary;

  res.render('version-43/uk-claims/actual-costs/resubmission-summary', {
    data,
    showResubSummary,
    maintainedTreatments,
    withdrawnTreatments,
    maintainedMonths,
    withdrawnMonths
  });
});


// Save details on claim summary and pass through to Claim history //
// Enter details of the claim
router.post([/claim-summary/], function(req, res) {
  // Date claim sent to MS
  const dateClaimSentDay = req.body['date-claim-sent-day'];
  const dateClaimSentMonth = req.body['date-claim-sent-month'];
  const dateClaimSentYear = req.body['date-claim-sent-year'];
  const dateClaimSent = dateClaimSentDay && dateClaimSentMonth && dateClaimSentYear
    ? `${dateClaimSentDay}/${dateClaimSentMonth}/${dateClaimSentYear}`
    : '07/04/2026';
  req.session.data['date-claim-sent'] = dateClaimSent;
  // Set flag that the date claim sent to the MS was provided in order to display the Resubmissions tab
  req.session.data['date-claim-sent-to-ms-provided'] = 'Yes'

  // Date Member State received the claim
  const dateDocsReceivedByMSDay = req.body['date-claim-documents-received-by-ms-day'];
  const dateDocsReceivedByMSMonth = req.body['date-claim-documents-received-by-ms-month'];
  const dateDocsReceivedByMSYear = req.body['date-claim-documents-received-by-ms-year'];
  const dateClaimDocumentsReceivedByMS = dateDocsReceivedByMSDay && dateDocsReceivedByMSMonth && dateDocsReceivedByMSYear
    ? `${dateDocsReceivedByMSDay}/${dateDocsReceivedByMSMonth}/${dateDocsReceivedByMSYear}`
    : '18/04/2026';
  req.session.data['date-claim-documents-received-by-ms'] = dateClaimDocumentsReceivedByMS;

  // Date S080 uploaded to DH eXchange
  const dateS080GlobalNoteUploadedDay = req.body['date-s080-global-note-uploaded-day'];
  const dateS080GlobalNoteUploadedMonth = req.body['date-s080-global-note-uploaded-month'];
  const dateS080GlobalNoteUploadedYear = req.body['date-s080-global-note-uploaded-year'];
  const dateS080GlobalNoteUploaded = dateS080GlobalNoteUploadedDay && dateS080GlobalNoteUploadedMonth && dateS080GlobalNoteUploadedYear
    ? `${dateS080GlobalNoteUploadedDay}/${dateS080GlobalNoteUploadedMonth}/${dateS080GlobalNoteUploadedYear}`
    : '07/04/2026';
  req.session.data['date-s080-global-note-uploaded'] = dateS080GlobalNoteUploaded;

  // Date claim documents delivered to the MS
  const dateClaimDocumentsDeliveredToMSDay = req.body['date-claim-documents-delivered-to-ms-day'];
  const dateClaimDocumentsDeliveredToMSMonth = req.body['date-claim-documents-delivered-to-ms-month'];
  const dateClaimDocumentsDeliveredToMSYear = req.body['date-claim-documents-delivered-to-ms-year'];
  const dateClaimDocumentsDeliveredToMS = dateClaimDocumentsDeliveredToMSDay && dateClaimDocumentsDeliveredToMSMonth && dateClaimDocumentsDeliveredToMSYear
    ? `${dateClaimDocumentsDeliveredToMSDay}/${dateClaimDocumentsDeliveredToMSMonth}/${dateClaimDocumentsDeliveredToMSYear}`
    : '07/04/2026';
  req.session.data['date-claim-documents-delivered-to-ms'] = dateClaimDocumentsDeliveredToMS;

    // Date claim documents acknowledged by the MS
    const dateClaimDocumentsAcknowledgedByMSDay = req.body['date-claim-documents-acknowledged-by-ms-day'];
    const dateClaimDocumentsAcknowledgedByMSMonth = req.body['date-claim-documents-acknowledged-by-ms-month'];
    const dateClaimDocumentsAcknowledgedByMSYear = req.body['date-claim-documents-acknowledged-by-ms-year'];
    const dateClaimDocumentsAcknowledgedByMS = dateClaimDocumentsAcknowledgedByMSDay && dateClaimDocumentsAcknowledgedByMSMonth && dateClaimDocumentsAcknowledgedByMSYear
      ? `${dateClaimDocumentsAcknowledgedByMSDay}/${dateClaimDocumentsAcknowledgedByMSMonth}/${dateClaimDocumentsAcknowledgedByMSYear}`
      : '18/04/2026';
    req.session.data['date-claim-documents-acknowledged-by-ms'] = dateClaimDocumentsAcknowledgedByMS;

  // Store other form fields
  req.session.data['claim-sent-to-ms-by'] = req.body['claim-sent-to-ms-by'];
  req.session.data['s080-uploaded-by'] = req.body['s080-uploaded-by'];
  req.session.data['claim-sent-by'] = req.body['claim-sent-by'];
  req.session.data['rina-claim-rina-ref-no'] = req.body['rina-claim-rina-ref-no'];

  // Conditional flag to track claim summary details updated
  req.session.data['claim-summary-details-updated'] = 'yes';

  // Conditional flag to track if the date the claim documents were delivered to the MS has been updated
  req.session.data['date-claim-documents-delivered-to-ms-updated'] = 'yes';

  // Conditional flag to track if the date the claim documents were acknowledged by the MS has been updated
  req.session.data['date-claim-documents-acknowledged-by-ms-updated'] = 'yes';


  // Push data through to Claim history screen
  res.redirect('/version-43/uk-claims/actual-costs/claim-history');
});

// Pull through the input data onto the Claim history screen
router.get([/claim-history/], function(req, res) {
  res.render('version-43/uk-claims/actual-costs/claim-history', {
    data: req.session.data
  });
});


// Resubmissions //

// Create new resubmission
router.post([/create-new-actual-cost-resubmission/], function(req, res) {
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
  req.session.data['number-of-contested-treatments'] = req.body['number-of-contested-treatments'];
  req.session.data['value-contested'] = req.body['value-contested'];
  req.session.data['member-state-reference'] = req.body['member-state-reference'];

  // Conditional flag to track resubmission
  req.session.data['create-new-resub'] = 'yes';

  // Redirect to next screen
  res.redirect('/version-43/uk-claims/actual-costs/confirmation-actual-cost-resubmission-created');
});

// Pull through the input data onto the cya screen
router.get([/confirmation-actual-cost-resubmission-created/], function(req, res) {

  // Conditional flag to track resubmission
  req.session.data['create-new-resub'] = 'yes';

  res.render('version-43/resubmissions/pending-resubmissions', {
    data: req.session.data
  });
});


// Handle treatment selection on the add-treatments-to-resubmission screen
router.post([/add-treatments-to-resubmission/], function(req, res) {
  const selectedTreatments = req.body.selectedTreatments || []; // array of treatment IDs

  // Save selected treatment IDs to session
  req.session.data.selectedTreatments = selectedTreatments;

  // Redirect to the confirmation/check screen
  res.redirect('/version-43/uk-claims/actual-costs/check-treatment-added-to-resubmission');
});


router.post([/check-treatments-added-to-resubmission/], function(req, res) {
  const selectedTreatments = req.body.selectedTreatments || []; // this is an array of selected IDs

  // Save them into the session
  req.session.data.selectedTreatments = selectedTreatments;

  // Optional: Set other status flags
  req.session.data['add-treatments-to-resub'] = 'yes';
  req.session.data.resubStatus = 'treatments-added-to-resub';
  req.session.data.showResubSummary = true;

  // Redirect to confirmation screen or back to resubmission overview
  res.redirect('/version-43/uk-claims/actual-costs/resubmissions');
});


router.get([/resubmissions/], function(req, res) {
  const data = req.session.data;

  if (req.query['create-new-resub']) {
    data['create-new-resub'] = req.query['create-new-resub'];
  }

  const existingStatus = data.resubStatus || '';

  const statusPriority = [
    'treatments-added-to-resub',
    'ready-to-send-for-peer-review',
    'peer-review-requested',
    'assigned-for-review',
    'peer-reviewed',
    'resubmission-sent-to-dh',
    'resubmission-completed'
  ];

  const currentIndex = statusPriority.indexOf(existingStatus);
  let desiredStatus = existingStatus;

  // --- Date checks ---
  const dhDateEntered = data['date-resubmission-uploaded-to-dh-exchange'];
  const msDateEntered = data['date-resubmission-sent-to-ms'];

  if (dhDateEntered && msDateEntered) {
    if (statusPriority.indexOf('resubmission-completed') > currentIndex) {
      desiredStatus = 'resubmission-completed';
    }
  } else if (dhDateEntered) {
    if (statusPriority.indexOf('resubmission-sent-to-dh') > currentIndex) {
      desiredStatus = 'resubmission-sent-to-dh';
    }
  }

  // --- Treatment review checks ---
  const statuses = data.treatmentStatuses || {};
  const treatmentList = ['Jane'];

  const allReviewed = Object.keys(statuses).length === treatmentList.length &&
                      Object.values(statuses).every(status => status !== '');

  if (allReviewed) {
    if (statusPriority.indexOf('ready-to-send-for-peer-review') > statusPriority.indexOf(desiredStatus)) {
      desiredStatus = 'ready-to-send-for-peer-review';
    }
  }

  // --- Final save ---
  data.resubStatus = desiredStatus;

  res.render('version-43/uk-claims/actual-costs/resubmissions', {
    data
  });
});

router.post([/resubmission-summary/], function (req, res) {
  const data = req.session.data;

  data['resub-summary-details-updated'] = 'yes';

  const existingStatus = data.resubStatus || '';

  // === Claim sent to MS date handling ===
  const msDay = req.body['date-resubmission-sent-to-ms-day'];
  const msMonth = req.body['date-resubmission-sent-to-ms-month'];
  const msYear = req.body['date-resubmission-sent-to-ms-year'];

  const msDateEntered = msDay && msMonth && msYear;

  if (msDateEntered) {
    data['date-resubmission-sent-to-ms'] = `${msDay}/${msMonth}/${msYear}`;
  } else if (!data['date-resubmission-sent-to-ms']) {
    data['date-resubmission-sent-to-ms'] = '';
  }

  // === DH Date Handling ===
  const dhDay = req.body['date-resubmission-uploaded-to-dh-exchange-day'];
  const dhMonth = req.body['date-resubmission-uploaded-to-dh-exchange-month'];
  const dhYear = req.body['date-resubmission-uploaded-to-dh-exchange-year'];

  const dhDateEntered = dhDay && dhMonth && dhYear;

  if (dhDateEntered) {
    data['date-resubmission-uploaded-to-dh-exchange'] = `${dhDay}/${dhMonth}/${dhYear}`;
  } else if (!data['date-resubmission-uploaded-to-dh-exchange']) {
    data['date-resubmission-uploaded-to-dh-exchange'] = '';
  }

  // === Status Upgrade Logic ===
  const statusPriority = [
    'treatments-added-to-resub',
    'ready-to-send-for-peer-review',
    'peer-review-requested',
    'assigned-for-review',
    'peer-reviewed',
    'resubmission-sent-to-dh',
    'resubmission-completed'
  ];

  const reviewStatuses = [
    'ready-to-send-for-peer-review',
    'peer-review-requested',
    'assigned-for-review',
    'peer-reviewed'
  ];

  let desiredStatus = existingStatus;

  if (reviewStatuses.includes(existingStatus)) {
    desiredStatus = existingStatus;
  } else {
    if (msDateEntered && dhDateEntered) {
      desiredStatus = 'resubmission-completed';
    } else if (dhDateEntered) {
      desiredStatus = 'resubmission-sent-to-dh';
    }
  }

  // Only promote if new status is later
  const currentIndex = statusPriority.indexOf(existingStatus);
  const desiredIndex = statusPriority.indexOf(desiredStatus);

  if (desiredIndex > currentIndex) {
    data.resubStatus = desiredStatus;
  } else {
    data.resubStatus = existingStatus;
  }

  // === Recheck treatment reviews and auto-upgrade ===
  const statuses = data.treatmentStatuses || {};
  const treatmentList = ['Jane'];

  const allReviewed = Object.keys(statuses).length === treatmentList.length &&
                      Object.values(statuses).every(status => status !== '');

  if (allReviewed) {
    const reviewIndex = statusPriority.indexOf('ready-to-send-for-peer-review');
    const currentStatusIndex = statusPriority.indexOf(data.resubStatus);

    if (reviewIndex > currentStatusIndex) {
      data.resubStatus = 'ready-to-send-for-peer-review';
    }
  }

  // === Claim delivered to MS date handling ===
  const deliveredToMSDay = req.body['date-resubmission-delivered-to-ms-day'];
  const deliveredToMSMonth = req.body['date-resubmission-sent-to-ms-month'];
  const deliveredToMSYear = req.body['date-resubmission-sent-to-ms-year'];

  if (deliveredToMSDay && deliveredToMSMonth && deliveredToMSYear) {
    data['date-resubmission-delivered-to-ms'] = `${deliveredToMSDay}/${deliveredToMSMonth}/${deliveredToMSYear}`;
  } else if (!data['date-resubmission-delivered-to-ms']) {
    data['date-resubmission-delivered-to-ms'] = '';
  }

  res.redirect('/version-43/uk-claims/actual-costs/resubmission-summary');
});

// Upload treatment evidence 

// Choose a file to upload
router.post([/treatment-upload-evidence/], function(req, res) {

  const uploadAdditionalEvidence = req.session.data['upload-additional-evidence']

  if (uploadAdditionalEvidence === 'yes'){
    res.redirect('/version-43/uk-claims/actual-costs/treatment-upload-additional-evidence?more-evidence=yes')
  } else {
    res.redirect('/version-43/uk-claims/actual-costs/treatment-upload-additional-evidence')
  }

})

// Do you want to upload additional evidence?
router.post([/treatment-upload-additional-evidence/], function(req, res) {
  
  const uploadAdditionalEvidence = req.session.data['upload-additional-evidence']

  if (uploadAdditionalEvidence === 'yes'){
    res.redirect('/version-43/uk-claims/actual-costs/treatment-upload-evidence?upload-additional-evidence=yes')
  } else {
    res.redirect('/version-43/uk-claims/actual-costs/check-uploaded-treatment-evidence')
  }

})

// Check the chosen evidence to upload
router.post([/check-uploaded-treatment-evidence/], function(req, res) {

  // Conditional flag to track if evidence has been uploaded
  req.session.data['upload-new-evidence'] = 'yes';

  // Redirect to the resubmission page
  res.redirect('/version-43/uk-claims/actual-costs/treatment-evidence');
});


// Maintain journey //
// Select the reasons to  maintain the treatment cost
router.post([/reasons-to-maintain-treatment-cost/], function(req, res) {

  let maintainReasons = req.body['reasons-to-maintain-treatment-cost'] || [];

  // Ensure it's always an array
  if (!Array.isArray(maintainReasons)) {
    maintainReasons = [maintainReasons];
  }

  // Remove unwanted values like "_unchecked"
  maintainReasons = maintainReasons.filter(r => r && r !== '_unchecked');

  // Save cleaned data
  req.session.data['reasons-to-maintain-treatment-cost'] = maintainReasons;

  res.redirect('/version-43/uk-claims/actual-costs/cya-maintain-treatment-cost');
});


// Pull through the input data onto the cya screen
router.get([/cya-maintain-treatment-cost/], function(req, res) {
  res.render('version-43/uk-claims/actual-costs/cya-maintain-treatment-cost', {
    data: req.session.data
  });
});

// Redirect cya to treatments within the resubmission screen
router.post([/cya-maintain-treatment-cost/], function(req, res) {
  const treatment = req.session.data.treatment;

  // Original cost per treatment
  const treatmentCosts = {
    'Jane': 300.00
  };

  if (treatment) {
    req.session.data.treatmentStatuses = req.session.data.treatmentStatuses || {};
    req.session.data.treatmentStatuses[treatment] = 'Maintained';

    // Update treatmentCostSplits
    req.session.data.treatmentCostSplits = req.session.data.treatmentCostSplits || {};
    req.session.data.treatmentCostSplits[treatment] = {
      maintained: treatmentCosts[treatment] || 0,
      withdrawn: 0
    };
  }

  res.redirect('/version-43/uk-claims/actual-costs/treatments-within-resubmission');
});


// Withdraw journey //
// Who made the request to withdraw?
router.post([/source-of-treatment-withdrawal/], function(req, res) {

  // Store the source of the withdrawal request
  const sourceOfTreatmentWithdrawal = req.body['treatment-withdrawal-source'];
  req.session.data['treatment-withdrawal-source'] = sourceOfTreatmentWithdrawal;

  // Redirect to select the reasons for withdrawing treatment cost claimed
  res.redirect('/version-43/uk-claims/actual-costs/reasons-to-withdraw-treatment-cost');
});

// Select the reasons to withdraw the treatment cost
router.post([/reasons-to-withdraw-treatment-cost/], function(req, res) {

  let withdrawReasons = req.body['reasons-to-withdraw-treatment-cost'] || [];

  // Ensure it's always an array
  if (!Array.isArray(withdrawReasons)) {
    withdrawReasons = [withdrawReasons];
  }

  // Remove unwanted values like "_unchecked"
  withdrawReasons = withdrawReasons.filter(r => r && r !== '_unchecked');

  // Save cleaned data
  req.session.data['reasons-to-withdraw-treatment-cost'] = withdrawReasons;


  // Redirect to add additional comments (optional)
  res.redirect('/version-43/uk-claims/actual-costs/cya-withdraw-treatment-cost');
});


router.post([/cya-withdraw-treatment-cost/], function(req, res) {
  const treatment = req.session.data.treatment; // e.g. 'Jane'
  const treatmentMonths = {
    'Jane': 300.00
  };

  // Set treatment status
  req.session.data.treatmentStatuses = req.session.data.treatmentStatuses || {};
  if (treatment) {
    req.session.data.treatmentStatuses[treatment] = 'Withdrawn';
  }

  // Set or update treatmentMonthSplits
  req.session.data.treatmentMonthSplits = req.session.data.treatmentMonthSplits || {};

  req.session.data.treatmentMonthSplits[treatment] = {
    maintained: 0,
    withdrawn: treatmentMonths[treatment] || 0
  };

  res.redirect('/version-43/uk-claims/actual-costs/treatments-within-resubmission');
});



// Partially maintain and partially withdraw journey //
// Enter the new accounting period
router.post([/enter-maintained-treatment-dates/], function(req, res) {

  // Start date of first maintained month date
  const startDateMaintainedTreatmentDay = req.body['start-date-maintained-treatment-day'];
  const startDateMaintainedTreatmentMonth = req.body['start-date-maintained-treatment-month'];
  const startDateMaintainedTreatmentYear = req.body['start-date-maintained-treatment-year'];
  const startDateMaintainedTreatment = startDateMaintainedTreatmentDay && startDateMaintainedTreatmentMonth && startDateMaintainedTreatmentYear
    ? `${startDateMaintainedTreatmentDay}/${startDateMaintainedTreatmentMonth}/${startDateMaintainedTreatmentYear}`
    : '01/02/2023';
  req.session.data['start-date-maintained-treatment'] = startDateMaintainedTreatment;

  // End date of last maintained month date
  const endDateMaintainedTreatmentDay = req.body['end-date-maintained-treatment-day'];
  const endDateMaintainedTreatmentMonth = req.body['end-date-maintained-treatment-month'];
  const endDateMaintainedTreatmentYear = req.body['end-date-maintained-treatment-year'];
  const endDateMaintainedTreatment = endDateMaintainedTreatmentDay && endDateMaintainedTreatmentMonth && endDateMaintainedTreatmentYear
    ? `${endDateMaintainedTreatmentDay}/${endDateMaintainedTreatmentMonth}/${endDateMaintainedTreatmentYear}`
    : '01/02/2023';
  req.session.data['end-date-maintained-treatment'] = endDateMaintainedTreatment;

  // Redirect to the confirm partial
  res.redirect('/version-43/uk-claims/actual-costs/confirm-maintained-and-withdrawn-costs');
});

// Confirm maintained and withdrawn treatment costs
router.post([/confirm-maintained-and-withdrawn-costs/], function(req, res) {

  // Maintained cost
  const partialMaintainedTreatmentCost = req.body['partial-maintained-treatment-cost'];
  req.session.data['partial-maintained-treatment-cost'] = partialMaintainedTreatmentCost;

  // Withdrawn cost
  const partialWithdrawnTreatmentCost = req.body['partial-withdrawn-treatment-cost'];
  req.session.data['partial-withdrawn-treatment-cost'] = partialWithdrawnTreatmentCost;

  // Redirect to the confirm partial
  res.redirect('/version-43/uk-claims/actual-costs/reasons-to-partially-maintain-treatment-cost');
});

// Select the reasons to partially maintain the treatment cost
router.post([/reasons-to-partially-maintain-treatment-cost/], function(req, res) {

  let partialMaintainReasons = req.body['reasons-to-partially-maintain-treatment-cost'] || [];

  // Ensure it's always an array
  if (!Array.isArray(partialMaintainReasons)) {
    partialMaintainReasons = [partialMaintainReasons];
  }

  // Remove unwanted values like "_unchecked"
  partialMaintainReasons = partialMaintainReasons.filter(r => r && r !== '_unchecked');

  // Save cleaned data
  req.session.data['reasons-to-partially-maintain-treatment-cost'] = partialMaintainReasons;


  // Redirect to add additional comments (optional)
  res.redirect('/version-43/uk-claims/actual-costs/source-of-partial-treatment-withdrawal');
});

// Who made the request to withdraw?
router.post([/source-of-partial-treatment-withdrawal/], function(req, res) {

  // Store the source of the partial withdrawal request
  const sourceOfPartialTreatmentWithdrawal = req.body['treatment-partial-withdrawal-source'];
  req.session.data['treatment-partial-withdrawal-source'] = sourceOfPartialTreatmentWithdrawal;

  // Redirect to select the reasons for withdrawing treatment cost claimed
  res.redirect('/version-43/uk-claims/actual-costs/reasons-to-partially-withdraw-treatment-cost');
});

// Select the reasons to withdraw the treatment cost
router.post([/reasons-to-partially-withdraw-treatment-cost/], function(req, res) {

  let partialWithdrawReasons = req.body['reasons-to-partially-withdraw-treatment-cost'] || [];

  // Ensure it's always an array
  if (!Array.isArray(partialWithdrawReasons )) {
    partialWithdrawReasons  = [partialWithdrawReasons ];
  }

  // Remove unwanted values like "_unchecked"
  partialWithdrawReasons  = partialWithdrawReasons .filter(r => r && r !== '_unchecked');

  // Save cleaned data
  req.session.data['reasons-to-partially-withdraw-treatment-cost'] = partialWithdrawReasons ;


  // Redirect to cya
  res.redirect('/version-43/uk-claims/actual-costs/cya-partially-maintain-and-withdraw-treatment-cost');
});

router.post([/cya-partially-maintain-and-withdraw-treatment-cost/], function(req, res) {
  const treatment = req.session.data.treatment; // e.g. 'Jane'
  const treatmentMonths = {
    'Jane': 300.00
  };

  // Set treatment status
  req.session.data.treatmentStatuses = req.session.data.treatmentStatuses || {};
  if (treatment) {
    req.session.data.treatmentStatuses[treatment] = 'Partial';
  }

  // Set or update treatmentMonthSplits
  req.session.data.treatmentMonthSplits = req.session.data.treatmentMonthSplits || {};

  req.session.data.treatmentMonthSplits[treatment] = {
    maintained: 0,
    withdrawn: treatmentMonths[treatment] || 0
  };

  res.redirect('/version-43/uk-claims/actual-costs/treatments-within-resubmission');
});

router.get([/treatments-within-resubmission/], function (req, res) {
  const data = req.session.data;
  const statuses = data.treatmentStatuses || {};
  const treatmentList = ['Jane'];

  const allReviewed = Object.keys(statuses).length === treatmentList.length &&
                      Object.values(statuses).every(status => status !== '');

  const currentStatus = data.resubStatus;

  // Update to 'ready-to-send-for-peer-review' if everything reviewed and we're still in early status
  if (allReviewed && (!currentStatus || currentStatus === 'treatments-added-to-resub')) {
    data.resubStatus = 'ready-to-send-for-peer-review';
  }

  // Handle transitions
  if (req.query['send-for-peer-review'] === 'yes') {
    data.resubStatus = 'peer-review-requested';
  }

  if (req.query['assign-to-me'] === 'yes') {
    data.resubStatus = 'assigned-for-review';
  }

  if (req.query['set-as-peer-reviewed'] === 'yes') {
    data.resubStatus = 'peer-reviewed';
  }

  res.render('version-43/uk-claims/actual-costs/treatments-within-resubmission', {
    data
  });
});

router.get([/treatment-details/], function(req, res) {
  res.render('version-43/uk-claims/actual-costs/treatment-details', {
    data: req.session.data
  });
});
module.exports = router;