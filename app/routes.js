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
router.use('/version-15', require('./views/version-15/_routes'));
router.use('/version-16', require('./views/version-16/_routes'));
router.use('/version-17', require('./views/version-17/_routes'));
router.use('/version-18', require('./views/version-18/_routes'));
router.use('/version-19', require('./views/version-19/_routes'));
router.use('/version-20', require('./views/version-20/_routes'));
router.use('/version-22', require('./views/version-22/_routes'));
router.use('/version-22/pb6', require('./views/version-22/_routes'));
router.use('/version-22/pb6/data-input-error', require('./views/version-22/_routes'));
router.use('/version-22/pb6/change-of-address', require('./views/version-22/_routes'));
router.use('/version-23/pb7/v1', require('./views/version-23/_routes'));
router.use('/version-23/pb7/v2', require('./views/version-23/_routes'));
router.use('/version-23/pb7/v3', require('./views/version-23/_routes'));
router.use('/version-24/pb7/v4', require('./views/version-24/_routes'));
router.use('/doug-html-examples', require('./views/doug-html-examples/_routes'));
router.use('/version-25', require('./views/version-25/_routes'));
router.use('/version-25/v1', require('./views/version-25/_routes'));
router.use('/version-25/v2', require('./views/version-25/_routes'));
router.use('/version-25/v3', require('./views/version-25/_routes'));
router.use('/version-26/pb7/v4', require('./views/version-26/_routes'));
router.use('/version-26/pb7/v5', require('./views/version-26/_routes'));
router.use('/version-27/s1', require('./views/version-27/s1/_routes'));
router.use('/version-27/ovm', require('./views/version-27/ovm/_routes'));

module.exports = router;

