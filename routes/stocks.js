const express = require("express");
const router = express.Router();


router.post("/update-stock", async (req, res) => {
    res.send(200);
});

module.exports = router;