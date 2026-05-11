const { register, verifyEmail, resendOTP, login, getAllUsers, getUserById } = require('../controller/userController');
const passport = require('passport')
const router = require('express').Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *           example: John Doe
 *         email:
 *           type: string
 *           description: User email address
 *           example: example@example.com
 *         phoneNumber:
 *           type: string
 *           description: the user phone number
 *           example: 1234567890
 *         password:
 *           type: string
 *           description: User password
 *           example: password123
 *         confirmPassword:
 *           type: string
 *           description: Confirm user password
 *           example: password123
 */


/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Register a new user with name, email, phone number, password and confirm password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User email address
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: password123
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm user password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: User registered successfully
 */
router.post('/register', register);

router.post('/verify', verifyEmail);

router.post('/resend-otp', resendOTP);

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: login a user
 *     description: Login an existing user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: User logged in successfully
 */
router.post('/login', login);

router.get('/collect', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/googleLogin', passport.authenticate('google', {
    successRedirect: '/api/user/loginsuccess', 
    failureRedirect: '/api/user/loginfailed'}))

router.get('/loginsuccess', (req, res) => {
        res.json({message: 'Login successful', 
            data: req.user})
    })

router.get('/loginfailed', (req, res) => {
        res.json({message: 'Login failed'})
    })  
    

router.get('/githubLogin', passport.authenticate('github2'));

router.get('/githubLogin/callback',passport.authenticate('github2', {failureRedirect: '/login',session: false}),
  (req, res)  => {
    res.json({message:"GitHub login successful", data:req.user});
  }
);

// router.get('/auth/facebook',
//   passport.authenticate('facebook'));

// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//    });    

/**
 * @swagger
 * /api/v1/user/getAllUsers:
 *   get:
 *     tags:
 *       - User
 *     summary: All users
 *     description: Get all users in the database
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The user ID
 *                         example: 60d0fe4f5311236168a109ca
 *                       firstName:
 *                         type: string
 *                         description: The user's first name
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         description: The user's last name
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         description: The user's email
 *                         example: example@example.com
 *                       phoneNumber:
 *                         type: string
 *                         description: The user's phone number
 *                         example: +1234567890
 *                       isVerified:
 *                         type: boolean
 *                         description: The user's verification status
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         description: The user's creation date
 *                         example: 2026-01-01T00:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         description: The user's update date
 *                         example: 2026-01-01T00:00:00.000Z
 */
router.get('/getAllUsers', getAllUsers)


/**
 * @swagger
 * /api/v1/user/getUser/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: A user
 *     description: Get a user by ID
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: The user ID
 *       schema:
 *         type: string
 *         example: 69cc1f3183fdc152c944204f
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                       id:
 *                         type: string
 *                         description: The user ID
 *                         example: 60d0fe4f5311236168a109ca
 *                       firstName:
 *                         type: string
 *                         description: The user's first name
 *                         example: John
 *                       lastName:
 *                         type: string
 *                         description: The user's last name
 *                         example: Doe
 *                       email:
 *                         type: string
 *                         description: The user's email
 *                         example: example@example.com
 *                       phoneNumber:
 *                         type: string
 *                         description: The user's phone number
 *                         example: +1234567890
 *                       isVerified:
 *                         type: boolean
 *                         description: The user's verification status
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         description: The user's creation date
 *                         example: 2026-01-01T00:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         description: The user's update date
 *                         example: 2026-01-01T00:00:00.000Z
 */
router.get('/getUser/:id', getUserById)


module.exports = router