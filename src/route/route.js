const express = require('express');
const { shortUrl } = require('../controller/urlController');
const router = express.Router();



router.post("/url/shorten", shortUrl);
router.get("/:urlCode" );



module.exports = router;