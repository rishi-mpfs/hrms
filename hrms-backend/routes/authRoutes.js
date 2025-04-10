const router = require('express').Router();
const { login, register, logout, me } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/me', verifyToken, me);

module.exports = router;