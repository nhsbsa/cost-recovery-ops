// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// S1 entitlement cancellation (Main insured record)

// Enter cancellation details
router.post([/cancellation-details/], (req, res) => {
  // Save the source in session data
  req.session.data['cancelled-by'] = req.body['cancelled-by'];

  // Extract the cancellation source from the request body
  const cancellationSource = req.body['cancelled-by'];
  
  // Extract day, month, and year from the request body
  const day = req.body['entitlement-end-date-day'];
  const month = req.body['entitlement-end-date-month'];
  const year = req.body['entitlement-end-date-year'];

  // Combine to form the full date (or use a default if not provided)
  const entitlementEndDate = day && month && year ? `${day}/${month}/${year}` : '13/01/2025';

  // Save the formatted date in session data
  req.session.data['entitlement-end-date'] = entitlementEndDate;

  // Extract and save the cancellation reason in session data
  const cancellationReason = req.body['cancellation-reason']; // FIX: Define this before using it
  req.session.data['cancellation-reason'] = cancellationReason;

  // Reasons requiring a dynamic date capture
  const dateCaptureReasons = [
    'The entitlement holder is no longer insured by the Member State',
    'The entitlement holder is no longer entitled to sickness benefit from the Member State',
    'The entitlement holder no longer lives in the UK',
    'The entitlement holder lives in another Member State',
    'The entitlement holder has died',
    'The dependant’s main insured has died'
  ];

  // Extract the selected country from the request body
  const statePensionCountry = req.body['state-pension-country'];

  // Save the country in session data
  req.session.data['state-pension-country'] = statePensionCountry;

  // Redirect to the next page
  res.redirect('/version-41/s1/account/cancellations/additional-comments-optional');
});



// Enter additional comments (optional)
router.post([/additional-comments-optional/], function (req, res) {
  // Retrieve and trim additional comments (default to empty string if not provided)
  const comments = (req.body['cancellation-additional-comments'] || '').trim();

  // Store comments in session data
  req.session.data['cancellation-additional-comments'] = comments;

  // Set flag based on whether a comment was entered
  req.session.data['add-cancellation-additional-comments'] = comments ? 'yes' : 'no';

  res.redirect('/version-41/s1/account/cancellations/cancellation-cya');

});
  

// Check your answers
router.post([/cancellation-cya/], function(req, res) {
  // Mark the entitlement as cancelled
  req.session.data['cancel-s1-entitlement'] = 'yes';

  // Retrieve the stored entitlement end date
  const entitlementEndDate = req.session.data['entitlement-end-date'];

  // Redirect to expired entitlement based on specific entitlement end date
  if (entitlementEndDate === '06/02/2020') {
      res.redirect('/version-41/s1/account/entitlement-content/expired-s1-entitlement-details');
  } else {
      res.redirect('/version-41/s1/account/entitlement-content/s1-entitlement-details');
  }
});


module.exports = router;