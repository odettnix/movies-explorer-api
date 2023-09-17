const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login, signOut } = require('../controllers/users');
const {
  singUp,
  signIn,
} = require('../middlewares/validations');
const auth = require('../middlewares/auth');

router.post('/signup', singUp, createUser);
router.post('/signin', signIn, login);
router.post('/signout', signOut);

router.use(auth);
router.use('/', require('./users'));
router.use('/', require('./movies'));

router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
