// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Average Cost Resubmissions //

// Set invoice month values per person (used for claim-summary totals)
const invoiceMonths = {
  'Jane': 3,
  'John': 4,
  'Dione': 9,
  'Jacqueline': 5,
  'Sophie': 9,
  'Paul': 2 // split: 1 maintained, 1 withdrawn
};

// Helper to check if all invoices have a status set
function allInvoicesHaveStatus(statuses, expectedCount) {
  return Object.keys(statuses).length === expectedCount &&
         Object.values(statuses).every(status => status !== '');
}


router.get([/claim-summary/], function(req, res) {

  const showResubSummary = req.session.data.showResubSummary;

  const statuses = req.session.data.invoiceStatuses || {};
  const months = {
    maintained: 0,
    withdrawn: 0,
    partial: 0
  };

  // Loop through each invoice and its status
  for (const [invoice, status] of Object.entries(statuses)) {
    const count = invoiceMonths[invoice] || 0;

    // Only add to maintained or withdrawn if the status is "Maintained" or "Withdrawn"
    if (status === 'Maintained') {
      months.maintained += count;
    } else if (status === 'Withdrawn') {
      months.withdrawn += count;
    } else if (status === 'Partial') {
      months.partial += count; // Add partials to partial category only
    }
  }

  // Split partial into half maintained + half withdrawn
  // We ensure that the partials are not contributing to the "Maintained" or "Withdrawn" months directly
  const partialMaintained = Math.floor(months.partial / 2);
  const partialWithdrawn = months.partial - partialMaintained;

  // Render the final totals with the split partials
  res.render('version-37/uk-claims/resubmissions/claim-summary', {
    data: req.session.data,
    maintainedMonths: months.maintained, // Maintained months should not include Paul's partials
    withdrawnMonths: months.withdrawn, // Withdrawn months should not include Paul's partials
    partialMaintainedMonths: partialMaintained,
    partialWithdrawnMonths: partialWithdrawn,
    showResubSummary
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
  req.session.data.resubStatus = 'invoices-added-to-resub';

  // Flag to always show resub summary after this point
  req.session.data.showResubSummary = true;

  // Redirect to the resubmission page
  res.redirect('/version-37/uk-claims/resubmissions/claim-resubmissions');
});


router.get([/claim-resubmissions/], function(req, res) {
  const data = req.session.data;

  if (req.query['create-new-resub']) {
    data['create-new-resub'] = req.query['create-new-resub'];
  }

  if (req.query.resubStatus) {
    data.resubStatus = req.query.resubStatus;
  }

  // Recheck invoice statuses to ensure 'resubStatus' is current
  const statuses = data.invoiceStatuses || {};
  const invoiceList = ['Jane', 'John', 'Dione', 'Jacqueline', 'Sophie', 'Paul'];

  const allReviewed = Object.keys(statuses).length === invoiceList.length &&
                      Object.values(statuses).every(status => status !== '');

  // Only update if not already peer-reviewed or sent
  if (allReviewed && (
    !data.resubStatus || 
    data.resubStatus === 'invoices-added-to-resub'
  )) {
    data.resubStatus = 'ready-to-send-for-peer-review';
  }

  res.render('version-37/uk-claims/resubmissions/claim-resubmissions', {
    data
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

  const invoice = req.session.data.invoice; // Get active invoice
  if (invoice) {
    req.session.data.invoiceStatuses = req.session.data.invoiceStatuses || {};
    req.session.data.invoiceStatuses[invoice] = 'Partial';
  }

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
  
  const invoice = req.session.data.invoice; // Get active invoice
  if (invoice) {
    req.session.data.invoiceStatuses = req.session.data.invoiceStatuses || {};
    req.session.data.invoiceStatuses[invoice] = 'Withdrawn';
  }

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
  
  const invoice = req.session.data.invoice; // Get active invoice
  if (invoice) {
    req.session.data.invoiceStatuses = req.session.data.invoiceStatuses || {};
    req.session.data.invoiceStatuses[invoice] = 'Maintained';
  }

  // Redirect to the resubmission page
  res.redirect('/version-37/uk-claims/resubmissions/invoices-within-resubmission');
});

router.get([/invoices-within-resubmission/], function (req, res) {
  const data = req.session.data;
  const statuses = data.invoiceStatuses || {};
  const invoiceList = ['Jane', 'John', 'Dione', 'Jacqueline', 'Sophie', 'Paul'];

  const allReviewed = Object.keys(statuses).length === invoiceList.length &&
                      Object.values(statuses).every(status => status !== '');

  const currentStatus = data.resubStatus;

  // Update to 'ready-to-send-for-peer-review' if everything reviewed and we're still in early status
  if (allReviewed && (!currentStatus || currentStatus === 'invoices-added-to-resub')) {
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

  res.render('version-37/uk-claims/resubmissions/invoices-within-resubmission', {
    data
  });
});

router.get([/invoice-details/], function(req, res) {
  res.render('version-37/uk-claims/resubmissions/invoice-details', {
    data: req.session.data
  });
});

// Pull through the input data onto the cya screen
router.get([/resubmission-summary/], function(req, res) {
  const data = req.session.data;

  // Preserve previous statuses
  const statuses = data.invoiceStatuses || {};
  const invoiceList = ['Jane', 'John', 'Dione', 'Jacqueline', 'Sophie', 'Paul'];

  const allReviewed = Object.keys(statuses).length === invoiceList.length &&
                      Object.values(statuses).every(status => status !== '');

  // Only upgrade to peer review if it's appropriate
  if (allReviewed && (!data.resubStatus || data.resubStatus === 'invoices-added-to-resub')) {
    data.resubStatus = 'ready-to-send-for-peer-review';
  }

  res.render('version-37/uk-claims/resubmissions/resubmission-summary', {
    data
  });
});

router.post([/resubmission-summary/], function (req, res) {
  const data = req.session.data;

  data['resub-summary-details-updated'] = 'yes';

  // --- Grab any existing status and store it before changing anything
  const existingStatus = data.resubStatus || '';

  // === MS Date Handling ===
  const msDay = req.body['date-resubmission-sent-to-ms-day'];
  const msMonth = req.body['date-resubmission-sent-to-ms-month'];
  const msYear = req.body['date-resubmission-sent-to-ms-year'];

  const msDateEntered = msDay && msMonth && msYear;
  if (msDateEntered) {
    data['date-resubmission-sent-to-ms'] = `${msDay}/${msMonth}/${msYear}`;
  }

  // === DH Date Handling ===
  const dhDay = req.body['date-resubmission-uploaded-to-dh-exchange-day'];
  const dhMonth = req.body['date-resubmission-uploaded-to-dh-exchange-month'];
  const dhYear = req.body['date-resubmission-uploaded-to-dh-exchange-year'];

  const dhDateEntered = dhDay && dhMonth && dhYear;
  if (dhDateEntered) {
    data['date-resubmission-uploaded-to-dh-exchange'] = `${dhDay}/${dhMonth}/${dhYear}`;
  }

  // === Status Upgrade Logic ===
  // Status hierarchy: peer-reviewed > resubmission-completed > resubmission-sent-to-dh > ready-to-send-for-peer-review > invoices-added-to-resub

  const statusPriority = [
    'invoices-added-to-resub',
    'ready-to-send-for-peer-review',
    'peer-review-requested',
    'assigned-for-review',
    'peer-reviewed',
    'resubmission-sent-to-dh',
    'resubmission-completed',
  ];

  let newStatus = existingStatus;

  if (msDateEntered && dhDateEntered) {
    newStatus = 'resubmission-completed';
  } else if (dhDateEntered) {
    newStatus = 'resubmission-sent-to-dh';
  }

  // Only upgrade status if new one is further along the chain
  const currentIndex = statusPriority.indexOf(existingStatus);
  const newIndex = statusPriority.indexOf(newStatus);

  if (newIndex > currentIndex) {
    data.resubStatus = newStatus;
  } else {
    data.resubStatus = existingStatus;
  }

  res.redirect('/version-37/uk-claims/resubmissions/resubmission-summary');
});











// Upload new evidence for invoice
router.post([/invoice-upload-evidence/], function(req, res) {
  
   // Conditional flag to track if evidence has been uploaded
   req.session.data['upload-new-evidence'] = 'yes';

  // Redirect to the resubmission page
  res.redirect('/version-37/uk-claims/resubmissions/invoice-evidence');
});

// Pull through and populate Resubmission history throughout different stages of resub journey
router.get([/resubmission-history/], function (req, res) {
  const data = req.session.data;

  const summaryUpdated = data['resub-summary-details-updated'] === 'yes';

  const showSentToMSRow = summaryUpdated && data['date-resubmission-sent-to-ms'];
  const showUploadedToDHRow = summaryUpdated && data['date-resubmission-uploaded-to-dh-exchange'];

  const isPeerReviewed = data.resubStatus === 'peer-reviewed';

  res.render('version-37/uk-claims/resubmissions/resubmission-history', {
    data,
    showSentToMSRow,
    showUploadedToDHRow,
    isPeerReviewed
  });
});


module.exports = router;