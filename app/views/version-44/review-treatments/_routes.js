const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies



// Enter the reason for cancelling the treatment
router.post('/reason-for-treatment-cancellation', (req, res) => {

    const treatmentCancellationReason = req.session.data['reason-for-treatment-cancellation']

    // Store the cancellation reason in the session data
    req.session.data['reason-for-treatment-cancellation'] = treatmentCancellationReason;
  
    req.session.data['treatment-cancelled'] = 'Yes'

    res.redirect('/version-44/review-treatments/cancelled-treatments')
  
})






module.exports = router