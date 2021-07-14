// External dependencies
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON bodies
router.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

// Add your routes here - above the module.exports line

router.use('/me-journey', require('./views/me-journey/_routes'));
router.use('/meo-journey', require('./views/meo-journey/_routes'));
router.use('/version-2', require('./views/version-2/_routes'));
router.use('/version-3', require('./views/version-3/_routes'));
router.use('/version-4', require('./views/version-4/_routes'));
router.use('/version-5', require('./views/version-5/_routes'));
router.use('/version-6', require('./views/version-6/_routes'));
router.use('/version-7', require('./views/version-7/_routes'));
router.use('/version-8', require('./views/version-8/_routes'));
router.use('/version-9', require('./views/version-9/_routes'));
router.use('/version-10', require('./views/version-10/_routes'));
router.use('/version-11', require('./views/version-11/_routes'));
router.use('/version-12', require('./views/version-12/_routes'));
router.use('/version-13', require('./views/version-13/_routes'));
router.use('/version-14', require('./views/version-14/_routes'));


module.exports = router;
