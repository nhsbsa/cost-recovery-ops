const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies


// Filter pending accounts by trust
router.post([/filter-by-trust/], function(req, res){

// Retrieve the name of the selected trust
const trustName = req.body['filter-trust-name'];

// Store the name of the selected trust in the session data
req.session.data['filter-trust-name'] = trustName;

// Set flag that the pending accounts have been filtered
req.session.data['filter-by-trust'] = 'Yes'

res.redirect('/version-46/account-requests/pending-requests');

})


// Review pending account request
router.post('/review-pending-request', (req, res) => {

    const approveAccount = req.session.data['approve-account']
  
    if (approveAccount === 'Yes') {
      req.session.data['account-approved'] = 'Yes'
      return res.redirect('approved-requests')
    }
  
    return res.redirect('reason-for-account-rejection')
  
})

// Select the reason for request rejection
router.post('/reason-for-account-rejection', function(req, res){

    // Retrieve the rejection reason
    const rejectionReason = req.body['reason-for-rejection'];
    
    // Store the name of the selected trust in the session data
    req.session.data['reason-for-rejection'] = rejectionReason;
    
    // Set flag that the pending accounts have been filtered
    req.session.data['account-rejected'] = 'Yes'
    
    res.redirect('/version-46/account-requests/rejected-requests');
    
})


// View an approved account request
router.post('/view-approved-request', function(req, res){

res.redirect('/version-46/account-requests/cancel-account');

})


// Cancel an account
router.post('/cancel-account', (req, res) => {

const cancelAccount = req.session.data['cancel-account']

if (cancelAccount === 'Yes') {
    
    return res.redirect('reason-for-account-cancellation')
} 
   return res.redirect('view-approved-request')

})

// Select the reason for request rejection
router.post('/reason-for-account-cancellation', function(req, res){

// Retrieve the cancellation reason
const cancellationReason = req.body['reason-for-cancellation'];

// Store the name of the selected trust in the session data
req.session.data['reason-for-cancellation'] = cancellationReason;

res.redirect('/version-46/account-requests/cya-cancel-account');
    
})

// Check your answers before cancelling the account
router.post('/cya-cancel-account', function(req, res){

// Set flag that the account has been cancelled
req.session.data['account-cancelled'] = 'Yes'

res.redirect('/version-46/account-requests/cancelled-accounts');

})

// Are you sure you want to cancel generating an S071?
router.get('/exit-cancelling-ovms-account', function (req, res) {
    req.session.data['return-url'] = req.query.from
  
    res.render('version-46/account-requests/exit-cancelling-ovms-account')
  })
  
  router.post('/exit-cancelling-ovms-account', function (req, res) {
    const exitCancelOVMSAccountJourney =
      req.session.data['exit-cancel-ovms-account-journey']
  
    if (exitCancelOVMSAccountJourney === 'Yes') {
      res.redirect('/version-46/account-requests/view-approved-request')
    } else {
      res.redirect(req.session.data['return-url'])
    }
  })
module.exports = router