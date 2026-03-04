const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ message: "Notices route working" });
});

module.exports = router;