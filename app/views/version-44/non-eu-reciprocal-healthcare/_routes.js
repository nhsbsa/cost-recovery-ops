const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Add treatment journey //

// Enter the treatment start date (optional)
router.post([/treatment-start-date/], function(req, res){

// Extract day, month, and year from the request body
const treatmentStartDateDay = req.body['treatment-start-date-day'];
const treatmentStartDateMonth = req.body['treatment-start-date-month'];
const treatmentStartDateYear = req.body['treatment-start-date-year'];

// Combine to form the full date (or use a default if not provided)
const treatmentStartDate = treatmentStartDateDay && treatmentStartDateMonth && treatmentStartDateYear 
? `${treatmentStartDateDay}/${treatmentStartDateMonth}/${treatmentStartDateYear}` 
: '01/01/2026';

// Save the formatted date in session data
req.session.data['treatment-start-date'] = treatmentStartDate;

// Redirect to treatment end date
res.redirect('/version-44/non-eu-reciprocal-healthcare/treatment-end-date');

})


// Enter the treatment end date (optional)
router.post([/treatment-end-date/], function(req, res){

// Extract day, month, and year from the request body
const treatmentEndDateDay = req.body['treatment-end-date-day'];
const treatmentEndDateMonth = req.body['treatment-end-date-month'];
const treatmentEndDateYear = req.body['treatment-end-date-year'];

// Combine to form the full date (or use a default if not provided)
const treatmentEndDate = treatmentEndDateDay && treatmentEndDateMonth && treatmentEndDateYear 
? `${treatmentEndDateDay}/${treatmentEndDateMonth}/${treatmentEndDateYear}` 
: '01/01/2026';

// Save the formatted date in session data
req.session.data['treatment-end-date'] = treatmentEndDate;

// Redirect to treatment cost
res.redirect('/version-44/non-eu-reciprocal-healthcare/treatment-cost');

})


// Enter the total treatment cost
router.post([/treatment-cost/], function(req, res){
// Extract the total treatment cost from the form
const treatmentCost = req.body['treatment-cost'];

// Store it in the session data
req.session.data['treatment-cost'] = treatmentCost;
    
// Redirect to select country
res.redirect('/version-44/non-eu-reciprocal-healthcare/select-country');
});


// Select the country the patient is from
router.post([/select-country/], function(req, res){
// Extract the country from the form
const patientFromCountry = req.body['patient-from-country'];

// Store it in the session data
req.session.data['patient-from-country'] = patientFromCountry;

// Redirect to check your answers
res.redirect('/version-44/non-eu-reciprocal-healthcare/enter-quota-number');
});


// Enter the Quota number for the patient
router.post([/enter-quota-number/], function(req, res){
// Extract the total treatment cost from the form
const quotaNumber = req.body['quota-number'];

// Store it in the session data
req.session.data['quota-number'] = quotaNumber;

// Redirect to check your answers
res.redirect('/version-44/non-eu-reciprocal-healthcare/patient-details');
});


// Enter the patient's details
router.post([/patient-details/], function(req, res){

// Extract the last name from the form
const lastName = req.body['last-name'];

// Extract the first names from the form
const firstNames = req.body['first-names'];

// Extract day, month, and year from the request body
const dateOfBirthDay = req.body['date-of-birth-day'];
const dateOfBirthMonth = req.body['date-of-birth-month'];
const dateOfBirthYear = req.body['date-of-birth-year'];

// Combine to form the full date (or use a default if not provided)
const dateOfBirth = dateOfBirthDay && dateOfBirthMonth && dateOfBirthYear 
? `${dateOfBirthDay}/${dateOfBirthMonth}/${dateOfBirthYear}` 
: '01/01/1986';

// Store the last name in the session data
req.session.data['last-name'] = lastName;

// Store the first names in the session data
req.session.data['first-name'] = firstNames;

// Save the date of birth in session data
req.session.data['date-of-birth'] = dateOfBirth;

// Redirect to check your answers
res.redirect('/version-44/non-eu-reciprocal-healthcare/add-treatment-cya');
});


// Check your answers
router.post([/add-treatment-cya/], function(req, res){
    
// Set flag that a new treatment was added
req.session.data['add-treatment'] = 'Yes';
    
// Redirect to confirmation treatment added screen
res.redirect('/version-44/non-eu-reciprocal-healthcare/confirmation-treatment-added');
});


// Confirmation new treatment added
router.post([/confirmation-treatment-added/], function(req, res){

        
// Redirect to confirmation treatment added screen
res.redirect('/version-44/non-eu-reciprocal-healthcare/home');
});

module.exports = router