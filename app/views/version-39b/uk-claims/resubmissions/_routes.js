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
  res.render('version-39b/uk-claims/resubmissions/claim-summary', {
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
  res.redirect('/version-39b/uk-claims/resubmissions/confirmation-resubmission-created');
});


// Confirm selected invoices are added to resubmission
router.post([/check-invoices-added-to-resubmission/], function(req, res) {
  // Update session to reflect that invoices are added
  req.session.data['add-invoices-to-resub'] = 'yes';

  // Flag to always show resub summary after this point
  req.session.data.showResubSummary = true;

  // Redirect to the resubmission page
  res.redirect('/version-39b/uk-claims/resubmissions/claim-resubmissions');
});


router.get([/claim-resubmissions/], function(req, res) {
  const data = req.session.data;

  if (req.query['create-new-resub']) {
    data['create-new-resub'] = req.query['create-new-resub'];
  }

  const existingStatus = data.resubStatus || '';

  const statusPriority = [
    'invoices-added-to-resub',
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

  // --- Invoice review checks ---
  const statuses = data.invoiceStatuses || {};
  const invoiceList = ['Jane', 'John'];

  const allReviewed = Object.keys(statuses).length === invoiceList.length &&
                      Object.values(statuses).every(status => status !== '');

  if (allReviewed) {
    if (statusPriority.indexOf('ready-to-send-for-peer-review') > statusPriority.indexOf(desiredStatus)) {
      desiredStatus = 'ready-to-send-for-peer-review';
    }
  }

  // --- Final save ---
  data.resubStatus = desiredStatus;

  res.render('version-39b/uk-claims/resubmissions/claim-resubmissions', {
    data
  });
});


// Select reasons for contestation against each individual invoice //
router.post([/invoice-reasons-for-contestation/], function(req, res) {

  const invoice = req.body.invoice;
  const reasonsForContestation = req.body['reasons-for-contestation'];
  const otherContestationReason = req.body['other-contestation-reason'];


  // Store the date actual costs cover from
  const dateActualCostsShouldCoverFromDay = req.body['date-actual-costs-should-cover-from-day'];
  const dateActualCostsShouldCoverFromMonth = req.body['date-actual-costs-should-cover-from-month'];
  const dateActualCostsShouldCoverFromYear = req.body['date-actual-costs-should-cover-from-year'];
  const dateActualCostsShouldCoverFrom = dateActualCostsShouldCoverFromDay && dateActualCostsShouldCoverFromMonth && dateActualCostsShouldCoverFromYear
    ? `${dateActualCostsShouldCoverFromDay}/${dateActualCostsShouldCoverFromMonth}/${dateActualCostsShouldCoverFromYear}`
    : '01/01/2025';
  req.session.data['date-actual-costs-should-cover-from'] = dateActualCostsShouldCoverFrom;


  // Store the date actual costs cover until
  const dateActualCostsShouldCoverUntilDay = req.body['date-actual-costs-should-cover-until-day'];
  const dateActualCostsShouldCoverUntilMonth = req.body['date-actual-costs-should-cover-until-month'];
  const dateActualCostsShouldCoverUntilYear = req.body['date-actual-costs-should-cover-until-year'];
  const dateActualCostsShouldCoverUntil = dateActualCostsShouldCoverUntilDay && dateActualCostsShouldCoverUntilMonth && dateActualCostsShouldCoverUntilYear
    ? `${dateActualCostsShouldCoverUntilDay}/${dateActualCostsShouldCoverUntilMonth}/${dateActualCostsShouldCoverUntilYear}`
    : '01/01/2025';
  req.session.data['date-actual-costs-should-cover-until'] = dateActualCostsShouldCoverUntil;


  // Store the duplicated global IMO reference and the duplicated individual IMO number
  const duplicatedGlobalIMOReference = req.body['duplicated-global-imo-reference'];
  const duplicatedIndividualIMONumber = req.body['duplicated-individual-imo-number'];

  req.session.data['duplicated-global-imo-reference'] = duplicatedGlobalIMOReference;
  req.session.data['duplicated-individual-imo-number'] = duplicatedIndividualIMONumber;


  // Store the date the entitlement in the state of residence started on
  const dateEntitlementInStateOfResidenceStartedOnDay = req.body['date-entitlement-in-state-of-residence-started-on-day'];
  const dateEntitlementInStateOfResidenceStartedOnMonth = req.body['date-entitlement-in-state-of-residence-started-on-month'];
  const dateEntitlementInStateOfResidenceStartedOnYear = req.body['date-entitlement-in-state-of-residence-started-on-year'];
  const dateEntitlementInStateOfResidenceStartedOn = dateEntitlementInStateOfResidenceStartedOnDay && dateEntitlementInStateOfResidenceStartedOnMonth && dateEntitlementInStateOfResidenceStartedOnYear
    ? `${dateEntitlementInStateOfResidenceStartedOnDay}/${dateEntitlementInStateOfResidenceStartedOnMonth}/${dateEntitlementInStateOfResidenceStartedOnYear}`
    : '01/01/2025';
  req.session.data['date-entitlement-in-state-of-residence-started-on'] = dateEntitlementInStateOfResidenceStartedOn;


  // Store the date the family member became entitled to benefits in their state of residence
  const dateFamilyMemberBecameEntitledToBenefitsInStateOfResidenceDay = req.body['date-family-member-became-entitled-to-benefits-in-state-of-residence-day'];
  const dateFamilyMemberBecameEntitledToBenefitsInStateOfResidenceMonth = req.body['date-family-member-became-entitled-to-benefits-in-state-of-residence-month'];
  const dateFamilyMemberBecameEntitledToBenefitsInStateOfResidenceYear = req.body['date-family-member-became-entitled-to-benefits-in-state-of-residence-year'];
  const dateFamilyMemberBecameEntitledToBenefitsInStateOfResidence = dateFamilyMemberBecameEntitledToBenefitsInStateOfResidenceDay && dateFamilyMemberBecameEntitledToBenefitsInStateOfResidenceMonth && dateFamilyMemberBecameEntitledToBenefitsInStateOfResidenceYear
    ? `${dateFamilyMemberBecameEntitledToBenefitsInStateOfResidenceDay}/${dateFamilyMemberBecameEntitledToBenefitsInStateOfResidenceMonth}/${dateFamilyMemberBecameEntitledToBenefitsInStateOfResidenceYear}`
    : '01/01/2025';
  req.session.data['date-family-member-became-entitled-to-benefits-in-state-of-residence'] = dateFamilyMemberBecameEntitledToBenefitsInStateOfResidence;


  // Store the date the person began receiving a state pension from their state of residence
  const datePersonBeganReceivingPensionInStateOfResidenceDay = req.body['date-person-began-receiving-pension-in-state-of-residence-day'];
  const datePersonBeganReceivingPensionInStateOfResidenceMonth = req.body['date-person-began-receiving-pension-in-state-of-residence-month'];
  const datePersonBeganReceivingPensionInStateOfResidenceYear = req.body['date-person-began-receiving-pension-in-state-of-residence-year'];
  const datePersonBeganReceivingPensionInStateOfResidence = datePersonBeganReceivingPensionInStateOfResidenceDay && datePersonBeganReceivingPensionInStateOfResidenceMonth && datePersonBeganReceivingPensionInStateOfResidenceYear
    ? `${datePersonBeganReceivingPensionInStateOfResidenceDay}/${datePersonBeganReceivingPensionInStateOfResidenceMonth}/${datePersonBeganReceivingPensionInStateOfResidenceYear}`
    : '01/01/2025';
  req.session.data['date-person-began-receiving-pension-in-state-of-residence'] = datePersonBeganReceivingPensionInStateOfResidence;


  // Store the date the person died
  const datePersonDiedDay = req.body['date-person-died-day'];
  const datePersonDiedMonth = req.body['date-person-died-month'];
  const datePersonDiedYear = req.body['date-person-died-year'];
  const datePersonDied = datePersonDiedDay && datePersonDiedMonth && datePersonDiedYear
    ? `${datePersonDiedDay}/${datePersonDiedMonth}/${datePersonDiedYear}`
    : '01/01/2025';
  req.session.data['date-person-died'] = datePersonDied;


  // Store the IMO was introduced after the deadline
  const dateIMOIntroducedAfterDeadlineDay = req.body['date-imo-introduced-after-deadline-day'];
  const dateIMOIntroducedAfterDeadlineMonth = req.body['date-imo-introduced-after-deadline-month'];
  const dateIMOIntroducedAfterDeadlineYear = req.body['date-imo-introduced-after-deadline-year'];
  const dateIMOIntroducedAfterDeadline = dateIMOIntroducedAfterDeadlineDay && dateIMOIntroducedAfterDeadlineMonth && dateIMOIntroducedAfterDeadlineYear
    ? `${dateIMOIntroducedAfterDeadlineDay}/${dateIMOIntroducedAfterDeadlineMonth}/${dateIMOIntroducedAfterDeadlineYear}`
    : '01/01/2025';
  req.session.data['date-imo-introduced-after-deadline'] = dateIMOIntroducedAfterDeadline;


  // Store the date the contestation IMO reply was received after the deadline
  const dateContestationIMOReplyReceivedAfterDeadlineDay = req.body['date-contestation-imo-reply-received-after-deadline-day'];
  const dateContestationIMOReplyReceivedAfterDeadlineMonth = req.body['date-contestation-imo-reply-received-after-deadline-month'];
  const dateContestationIMOReplyReceivedAfterDeadlineYear = req.body['date-contestation-imo-reply-received-after-deadline-year'];
  const dateContestationIMOReplyReceivedAfterDeadline = dateContestationIMOReplyReceivedAfterDeadlineDay && dateContestationIMOReplyReceivedAfterDeadlineMonth && dateContestationIMOReplyReceivedAfterDeadlineYear
    ? `${dateContestationIMOReplyReceivedAfterDeadlineDay}/${dateContestationIMOReplyReceivedAfterDeadlineMonth}/${dateContestationIMOReplyReceivedAfterDeadlineYear}`
    : '01/01/2025';
  req.session.data['date-contestation-imo-reply-received-after-deadline'] = dateContestationIMOReplyReceivedAfterDeadline;


  // Store the date the person moved to another state
  const datePersonMovedToAnotherStateDay = req.body['date-person-moved-to-another-state-day'];
  const datePersonMovedToAnotherStateMonth = req.body['date-person-moved-to-another-state-month'];
  const datePersonMovedToAnotherStateYear = req.body['date-person-moved-to-another-state-year'];
  const datePersonMovedToAnotherState = datePersonMovedToAnotherStateDay && datePersonMovedToAnotherStateMonth && datePersonMovedToAnotherStateYear
    ? `${datePersonMovedToAnotherStateDay}/${datePersonMovedToAnotherStateMonth}/${datePersonMovedToAnotherStateYear}`
    : '01/01/2025';
  req.session.data['date-person-moved-to-another-state'] = datePersonMovedToAnotherState;


  // Store reasons and other reason text linked to invoice
  if (!req.session.data.contestation_reasons) {
    req.session.data.contestation_reasons = {};
  }

  req.session.data.contestation_reasons[invoice] = {
    reasons: Array.isArray(reasonsForContestation) ? reasonsForContestation : [reasonsForContestation], 
    otherContestationReason: otherContestationReason
  };

  res.redirect('/version-39b/uk-claims/resubmissions/invoice-reasons-for-contestation?invoice=' + invoice);
});

// Pull through the selected reasons and reload the screen
router.get([/invoice-reasons-for-contestation/], function(req, res) {
  res.render('version-39b/uk-claims/resubmissions/invoice-reasons-for-contestation', {
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
  res.redirect('/version-39b/uk-claims/resubmissions/confirm-partially-maintained-and-partially-withdrawn-months');
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
  res.redirect('/version-39b/uk-claims/resubmissions/reasons-to-partially-maintain-months');
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

  // Check if reason includes 'Information requested updated. [04]' and redirect conditionally
  if (reasonToPartiallyMaintainMonths === 'Information requested updated. [04]') {
    return res.redirect('/version-39b/uk-claims/resubmissions/select-information-requested-partially-maintain');
  }

  // Redirect to select the source of the partial withdrawal request
  res.redirect('/version-39b/uk-claims/resubmissions/source-of-partial-withdrawal');
});

// Select the type of information requested if applicable
router.post([/select-information-requested-partially-maintain/], function(req, res) {

  // Store the reasons for maintaining months
  const typeInformationRequestedPartiallyMaintain = req.body['type-information-requested-partially-maintain'];
  req.session.data['type-information-requested-partially-maintain'] = typeInformationRequestedPartiallyMaintain;

  // Redirect to check your answers (maintain)
  res.redirect('/version-39b/uk-claims/resubmissions/source-of-partial-withdrawal');
});

// Who made the request to partially withdraw?
router.post([/source-of-partial-withdrawal/], function(req, res) {

  // Store the source of the partial withdrawal request
  const sourceOfPartialWithdrawal = req.body['partial-withdrawal-source'];
  req.session.data['partial-withdrawal-source'] = sourceOfPartialWithdrawal;

  // Redirect to select the reasons for partially withdrawing months claimed
  res.redirect('/version-39b/uk-claims/resubmissions/reasons-to-partially-withdraw-months');
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

  // Redirect to add additional comments (optional)
  res.redirect('/version-39b/uk-claims/resubmissions/partial-additional-comments');
});

// Add additional comments (optional)
router.post([/partial-additional-comments/], function(req, res) {

  // Retrieve and trim additional comments (default to empty string if not provided)
  const partialComments = (req.body['partial-additional-comments'] || '').trim();

  // Store comments in session data
  req.session.data['partial-additional-comments'] = partialComments;

  // Set flag based on whether a comment was entered
  req.session.data['add-partial-additional-comments'] = partialComments ? 'yes' : 'no';

  // Redirect to the resubmission page
  res.redirect('/version-39b/uk-claims/resubmissions/cya-partial-maintain-and-partial-withdraw');
});

// Pull through the input data onto the cya screen
router.get([/cya-partial-maintain-and-partial-withdraw/], function(req, res) {
  res.render('version-39b/uk-claims/resubmissions/cya-partial-maintain-and-partial-withdraw', {
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
  res.redirect('/version-39b/uk-claims/resubmissions/invoices-within-resubmission');
});


// Withdraw journey //
// Who made the request to withdraw?
router.post([/source-of-withdrawal/], function(req, res) {

  // Store the source of the withdrawal request
  const sourceOfWithdrawal = req.body['withdrawal-source'];
  req.session.data['withdrawal-source'] = sourceOfWithdrawal;

  // Redirect to select the reasons for withdrawing months claimed
  res.redirect('/version-39b/uk-claims/resubmissions/reasons-to-withdraw-months');
});

// Select the reasons to withdraw the months
router.post([/reasons-to-withdraw-months/], function(req, res) {

  // Store the reasons for  withdrawing months
  const reasonToWithdrawMonths = req.body['reasons-to-withdraw-months'];
  req.session.data['reasons-to-withdraw-months'] = reasonToWithdrawMonths;

  // Store the date the contestation was received (after deadline)
  const datePrimaryEntitlementInStateOfResidenceStartsOnDayWithdraw = req.body['date-primary-entitlement-in-state-of-residence-starts-on-day-withdraw'];
  const datePrimaryEntitlementInStateOfResidenceStartsOnMonthWithdraw = req.body['date-primary-entitlement-in-state-of-residence-starts-on-month-withdraw'];
  const datePrimaryEntitlementInStateOfResidenceStartsOnYearWithdraw = req.body['date-primary-entitlement-in-state-of-residence-starts-on-year-withdraw'];
  
  // Combine to form the full date (or use a default if not provided)
  const datePrimaryEntitlementInStateOfResidenceStartsOnWithdraw = datePrimaryEntitlementInStateOfResidenceStartsOnDayWithdraw && datePrimaryEntitlementInStateOfResidenceStartsOnMonthWithdraw && datePrimaryEntitlementInStateOfResidenceStartsOnYearWithdraw
  ? `${datePrimaryEntitlementInStateOfResidenceStartsOnDayWithdraw}/${datePrimaryEntitlementInStateOfResidenceStartsOnMonthWithdraw}/${datePrimaryEntitlementInStateOfResidenceStartsOnYearWithdraw}` 
  : '17/04/2026';
  req.session.data['date-primary-entitlement-in-state-of-residence-starts-on-withdraw'] = datePrimaryEntitlementInStateOfResidenceStartsOnWithdraw;


  // Store the date the state pension was received
  const dateStatePensionReceivedDayWithdraw = req.body['date-state-pension-received-day-withdraw'];
  const dateStatePensionReceivedMonthWithdraw = req.body['date-state-pension-received-month-withdraw'];
  const dateStatePensionReceivedYearWithdraw = req.body['date-state-pension-received-year-withdraw'];
  
  // Combine to form the full date (or use a default if not provided)
  const dateStatePensionReceivedWithdraw = dateStatePensionReceivedDayWithdraw && dateStatePensionReceivedMonthWithdraw && dateStatePensionReceivedYearWithdraw
  ? `${dateStatePensionReceivedDayWithdraw}/${dateStatePensionReceivedMonthWithdraw}/${dateStatePensionReceivedYearWithdraw}` 
  : '17/04/2024';
  req.session.data['date-state-pension-received-withdraw'] = dateStatePensionReceivedWithdraw;

  // Redirect to add additional comments (optional)
  res.redirect('/version-39b/uk-claims/resubmissions/withdraw-additional-comments');
});

// Add additional comments (optional)
router.post([/withdraw-additional-comments/], function(req, res) {

  // Retrieve and trim additional comments (default to empty string if not provided)
  const withdrawComments = (req.body['withdraw-additional-comments'] || '').trim();

  // Store comments in session data
  req.session.data['withdraw-additional-comments'] = withdrawComments;

  // Set flag based on whether a comment was entered
  req.session.data['add-withdraw-additional-comments'] = withdrawComments ? 'yes' : 'no';

  // Redirect to the resubmission page
  res.redirect('/version-39b/uk-claims/resubmissions/cya-withdraw');
});

// Pull through the input data onto the cya screen
router.get([/cya-withdraw/], function(req, res) {
  res.render('version-39b/uk-claims/resubmissions/cya-withdraw', {
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
  res.redirect('/version-39b/uk-claims/resubmissions/invoices-within-resubmission');
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

  // Check if reason includes 'Information requested updated. [04]' and redirect conditionally
  if (reasonToMaintainMonths === 'Information requested updated. [04]') {
    return res.redirect('/version-39b/uk-claims/resubmissions/select-information-requested-maintain');
  }

  // Redirect to check your answers (maintain)
  res.redirect('/version-39b/uk-claims/resubmissions/maintain-additional-comments');
});

// Select the type of information requested if applicable
router.post([/select-information-requested-maintain/], function(req, res) {

  // Store the reasons for maintaining months
  const typeInformationRequestedMaintain = req.body['type-information-requested-maintain'];
  req.session.data['type-information-requested-maintain'] = typeInformationRequestedMaintain;

  // Redirect to check your answers (maintain)
  res.redirect('/version-39b/uk-claims/resubmissions/maintain-additional-comments');
});

// Add additional comments (optional)
router.post([/maintain-additional-comments/], function(req, res) {

  // Retrieve and trim additional comments (default to empty string if not provided)
  const maintainComments = (req.body['maintain-additional-comments'] || '').trim();

  // Store comments in session data
  req.session.data['maintain-additional-comments'] = maintainComments;

  // Set flag based on whether a comment was entered
  req.session.data['add-maintain-additional-comments'] = maintainComments ? 'yes' : 'no';

  // Redirect to the resubmission page
  res.redirect('/version-39b/uk-claims/resubmissions/cya-maintain');
});

// Pull through the input data onto the cya screen
router.get([/cya-maintain/], function(req, res) {
  res.render('version-39b/uk-claims/resubmissions/cya-maintain', {
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
  res.redirect('/version-39b/uk-claims/resubmissions/invoices-within-resubmission');
});

router.get([/invoices-within-resubmission/], function (req, res) {
  const data = req.session.data;
  const statuses = data.invoiceStatuses || {};
  const invoiceList = ['Jane', 'John'];

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

  res.render('version-39b/uk-claims/resubmissions/invoices-within-resubmission', {
    data
  });
});

router.get([/invoice-details/], function(req, res) {
  res.render('version-39b/uk-claims/resubmissions/invoice-details', {
    data: req.session.data
  });
});

// Resubmission summary
router.get([/resubmission-summary/], function(req, res) {
  const data = req.session.data;

  const statuses = data.invoiceStatuses || {};
  const invoiceList = ['Jane', 'John'];

  const allReviewed = Object.keys(statuses).length === invoiceList.length &&
                      Object.values(statuses).every(status => status !== '');

  const statusPriority = [
    'invoices-added-to-resub',
    'ready-to-send-for-peer-review',
    'peer-review-requested',
    'assigned-for-review',
    'peer-reviewed',
    'resubmission-sent-to-dh',
    'resubmission-completed'
  ];

  let currentStatus = data.resubStatus || '';
  let currentIndex = statusPriority.indexOf(currentStatus);

  // Default logic if status not set or minimal
  if (!currentStatus || currentStatus === 'invoices-added-to-resub') {
    currentStatus = allReviewed ? 'ready-to-send-for-peer-review' : 'invoices-added-to-resub';
    currentIndex = statusPriority.indexOf(currentStatus);
  }

  // Upgrade status based on DH and MS dates
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

  // Reapply ready-to-send-for-peer-review if all reviewed and still below that status
  if (allReviewed) {
    const reviewedIndex = statusPriority.indexOf('ready-to-send-for-peer-review');
    if (reviewedIndex > currentIndex) {
      currentStatus = 'ready-to-send-for-peer-review';
    }
  }

  data.resubStatus = currentStatus;

  res.render('version-39b/uk-claims/resubmissions/resubmission-summary', {
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
    'invoices-added-to-resub',
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

  // === Recheck invoice reviews and auto-upgrade ===
  const statuses = data.invoiceStatuses || {};
  const invoiceList = ['Jane', 'John'];

  const allReviewed = Object.keys(statuses).length === invoiceList.length &&
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

  res.redirect('/version-39b/uk-claims/resubmissions/resubmission-summary');
});







// Choose a file to upload
router.post([/invoice-upload-evidence/], function(req, res) {

  const uploadAdditionalEvidence = req.session.data['upload-additional-evidence']

  if (uploadAdditionalEvidence === 'yes'){
    res.redirect('/version-39b/uk-claims/resubmissions/invoice-upload-additional-evidence?more-evidence=yes')
  } else {
    res.redirect('/version-39b/uk-claims/resubmissions/invoice-upload-additional-evidence')
  }

})

// Do you want to upload additional evidence?
router.post([/invoice-upload-additional-evidence/], function(req, res) {
  
  const uploadAdditionalEvidence = req.session.data['upload-additional-evidence']

  if (uploadAdditionalEvidence === 'yes'){
    res.redirect('/version-39b/uk-claims/resubmissions/invoice-upload-evidence?upload-additional-evidence=yes')
  } else {
    res.redirect('/version-39b/uk-claims/resubmissions/check-uploaded-invoice-evidence')
  }

})

// Check the chosen evidence to upload
router.post([/check-uploaded-invoice-evidence/], function(req, res) {

  // Conditional flag to track if evidence has been uploaded
  req.session.data['upload-new-evidence'] = 'yes';

  // Redirect to the resubmission page
  res.redirect('/version-39b/uk-claims/resubmissions/invoice-evidence');
});



// Pull through and populate Resubmission history throughout different stages of resub journey
router.get([/resubmission-history/], function (req, res) {
  const data = req.session.data;

  const summaryUpdated = data['resub-summary-details-updated'] === 'yes';

  const showSentToMSRow = summaryUpdated && data['date-resubmission-sent-to-ms'];
  const showUploadedToDHRow = summaryUpdated && data['date-resubmission-uploaded-to-dh-exchange'];
  const showDeliveredToMSRow = summaryUpdated && data['date-resubmission-delivered-to-ms'];

  const isPeerReviewed = data.resubStatus === 'peer-reviewed';

  res.render('version-39b/uk-claims/resubmissions/resubmission-history', {
    data,
    showSentToMSRow,
    showUploadedToDHRow,
    showDeliveredToMSRow,
    isPeerReviewed
  });
});


module.exports = router;