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

res.redirect('/version-44/account-requests/pending-requests');

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
router.post([/reason-for-account-rejection/], function(req, res){

    // Retrieve the rejection reason
    const rejectionReason = req.body['reason-for-rejection'];
    
    // Store the name of the selected trust in the session data
    req.session.data['reason-for-rejection'] = rejectionReason;
    
    // Set flag that the pending accounts have been filtered
    req.session.data['account-rejected'] = 'Yes'
    
    res.redirect('/version-44/account-requests/rejected-requests');
    
})


// View an approved account request
router.post([/view-approved-request/], function(req, res){

res.redirect('/version-44/account-requests/cancel-account');

})


// Cancel an account
router.post([/cancel-account/], (req, res) => {

const cancelAccount = req.session.data['cancel-account']

if (cancelAccount === 'Yes') {
    req.session.data['account-cancelled'] = 'Yes'
    return res.redirect('cancelled-accounts')
} 
   return res.redirect('view-approved-request')

})

module.exports = router