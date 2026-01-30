const express = require('express')
const router =  express.Router();
const { auth: roleAuth, requireAdmin, requireMemberOrAdmin } = require('../middlewares/roleAuth');
const {login, profile, birthdays, checkProfile, getProfile, upcomingBirthdays, wish, getWishes, getAllUsers, deleteUser, getUser, updateProfile} = require('../controllers/memberControllers')
const fileUpload = require('../middlewares/fileUpload');

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login (Guest or Member)
 *     description: Authenticate as either a guest user or family member
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           examples:
 *             guest_login:
 *               summary: Guest login
 *               value:
 *                 userType: "guest"
 *             member_login:
 *               summary: Member login
 *               value:
 *                 userType: "member"
 *                 familyName: "MFURA"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/api/login', login)


/**
 * @swagger
 * /api/profile:
 *   post:
 *     summary: Create user profile (Members & Admins)
 *     description: Create a new user profile. Both family members and administrators can access this endpoint.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *           example:
 *             name: "Yanis"
 *             email: "user@example.com"
 *             birthday: "1990-05-15"
 *             subFam: "SubFamily1"
 *             profilePic: "https://res.cloudinary.com/demo/image/upload/v123/profile.jpg"
 *     responses:
 *       200:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied - Members and Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/api/profile', roleAuth, requireMemberOrAdmin, fileUpload.single('profilePic'), profile)

/**
 * @swagger
 * /api/birthdays:
 *   get:
 *     summary: Get today's birthdays (Members & Admins)
 *     description: Retrieve today's birthdays and send email notifications to all family members. Both family members and administrators can access this endpoint.
 *     tags: [Birthdays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Birthday information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Status message
 *                 birthdays:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Birthday'
 *                 emailsSent:
 *                   type: boolean
 *                   description: Whether emails were sent
 *             examples:
 *               with_birthdays:
 *                 summary: When there are birthdays today
 *                 value:
 *                   message: "Birthday notifications sent!"
 *                   birthdays:
 *                     - name: "John Doe"
 *                     - name: "Jane Smith"
 *                   emailsSent: true
 *               no_birthdays:
 *                 summary: When no birthdays today
 *                 value:
 *                   message: "No one has a birthday today"
 *       403:
 *         description: Access denied - Members and Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/api/birthdays', roleAuth, requireMemberOrAdmin, birthdays)

/**
 * @swagger
 * /api/birthdays/upcoming:
 *   get:
 *     summary: Get upcoming birthdays in the next 30 days (Members & Admins)
 *     description: Retrieve all family members who have birthdays coming up in the next 30 days, sorted by how soon their birthday is.
 *     tags: [Birthdays]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Upcoming birthdays retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Found 3 upcoming birthdays in the next 30 days"
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 upcomingBirthdays:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d5ec49f1a2c8b1f8e4e1a0"
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *                       familyName:
 *                         type: string
 *                         example: "MFURA"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *                       subFam:
 *                         type: string
 *                         example: "TestFamily"
 *                       profilePicUrl:
 *                         type: string
 *                         example: "https://res.cloudinary.com/demo/image/upload/profile.jpg"
 *                       birthday:
 *                         type: string
 *                         format: date
 *                         example: "1990-05-15T00:00:00.000Z"
 *                       birthdayThisYear:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-05-15T00:00:00.000Z"
 *                       daysUntilBirthday:
 *                         type: integer
 *                         example: 15
 *                         description: "Number of days until their birthday"
 *                       ageTheyWillTurn:
 *                         type: integer
 *                         example: 34
 *                         description: "Age they will turn on their birthday"
 *                       birthdayFormatted:
 *                         type: string
 *                         example: "Wednesday, May 15, 2024"
 *             examples:
 *               with_upcoming_birthdays:
 *                 summary: When there are upcoming birthdays
 *                 value:
 *                   success: true
 *                   message: "Found 2 upcoming birthdays in the next 30 days"
 *                   count: 2
 *                   upcomingBirthdays:
 *                     - _id: "60d5ec49f1a2c8b1f8e4e1a0"
 *                       name: "Alice Smith"
 *                       familyName: "MFURA"
 *                       email: "alice@example.com"
 *                       daysUntilBirthday: 5
 *                       ageTheyWillTurn: 28
 *                       birthdayFormatted: "Saturday, December 30, 2024"
 *                     - _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *                       name: "Bob Johnson"
 *                       familyName: "SIMON"
 *                       email: "bob@example.com"
 *                       daysUntilBirthday: 12
 *                       ageTheyWillTurn: 45
 *                       birthdayFormatted: "Saturday, January 6, 2025"
 *               no_upcoming_birthdays:
 *                 summary: When no birthdays in next 30 days
 *                 value:
 *                   success: true
 *                   message: "No birthdays in the next 30 days"
 *                   count: 0
 *                   upcomingBirthdays: []
 *       403:
 *         description: Access denied - Members and Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/api/birthdays/upcoming', roleAuth, requireMemberOrAdmin, upcomingBirthdays)

/**
 * @swagger
 * /api/profile/check:
 *   get:
 *     summary: Check if user has a profile (Members & Admins)
 *     description: Check if the authenticated member has already created a profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasProfile:
 *                   type: boolean
 *                   description: Whether user has a profile
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       403:
 *         description: Access denied - Members and Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/api/profile/check', roleAuth, requireMemberOrAdmin, checkProfile)

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile (Members & Admins)
 *     description: Retrieve the complete profile information for the authenticated member
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied - Members and Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/api/profile', roleAuth, requireMemberOrAdmin, getProfile)


/**
 * @swagger
 * /api/birthdays/wishes:
 *   post:
 *     summary: Send birthday wishes (Members & Admins)
 *     description: Allows a family member or administrator to send birthday wishes. Both authenticated members and admins can access this endpoint. Wishes can only be posted if there is a birthday today or in the next 30 days.
 *     tags: [Birthdays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The birthday wish message
 *           example:
 *             text: "Happy Birthday, John! Wishing you a wonderful year ahead."
 *     responses:
 *       200:
 *         description: Wish sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     text:
 *                       type: string
 *                     sender:
 *                       type: string
 *                     profilePic:
 *                       type: string
 *       400:
 *         description: Invalid input or no birthdays
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Access denied - Members and Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   get:
 *     summary: Get birthday wishes with pagination
 *     description: Retrieve paginated birthday wishes posted by members, including sender's family name. Results are sorted by creation date (newest first).
 *     tags: [Birthdays]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of wishes per page
 *         example: 10
 *     responses:
 *       200:
 *         description: List of wishes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wishes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "651a1c2e2f8b1c3e4d5f6a7b"
 *                       text:
 *                         type: string
 *                         example: "Happy Birthday! Wishing you a fantastic year ahead."
 *                       sender:
 *                         type: string
 *                         example: "MFURA"
 *                       profilePic:
 *                         type: string
 *                         example: "https://res.cloudinary.com/demo/image/upload/profile.jpg"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00.000Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalWishes:
 *                       type: integer
 *                       example: 47
 *                     wishesPerPage:
 *                       type: integer
 *                       example: 10
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *             examples:
 *               first_page:
 *                 summary: First page of wishes
 *                 value:
 *                   wishes:
 *                     - _id: "651a1c2e2f8b1c3e4d5f6a7b"
 *                       text: "Happy Birthday! Wishing you a fantastic year ahead."
 *                       sender: "MFURA"
 *                       profilePic: "https://res.cloudinary.com/demo/image/upload/profile.jpg"
 *                       createdAt: "2024-01-15T10:30:00.000Z"
 *                     - _id: "651a1c2e2f8b1c3e4d5f6a7c"
 *                       text: "Many happy returns!"
 *                       sender: "KABERA"
 *                       profilePic: "https://res.cloudinary.com/demo/image/upload/kabera-profile.jpg"
 *                       createdAt: "2024-01-14T15:45:00.000Z"
 *                   pagination:
 *                     currentPage: 1
 *                     totalPages: 5
 *                     totalWishes: 47
 *                     wishesPerPage: 10
 *                     hasNextPage: true
 *                     hasPrevPage: false
 *       400:
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Page number must be greater than 0"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/api/birthdays/wishes', roleAuth, requireMemberOrAdmin, wish)
router.get('/api/birthdays/wishes', roleAuth, requireMemberOrAdmin, getWishes)

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users with pagination (Members & Admins)
 *     description: Retrieve all family members/profiles with pagination support. Both authenticated members and administrators can access this endpoint.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of users per page
 *         example: 20
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Retrieved 20 users"
 *                 count:
 *                   type: integer
 *                   description: Number of users in current page
 *                   example: 20
 *                 totalUsers:
 *                   type: integer
 *                   description: Total number of users in database
 *                   example: 45
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Profile'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     totalUsers:
 *                       type: integer
 *                       example: 45
 *                     usersPerPage:
 *                       type: integer
 *                       example: 20
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: false
 *             examples:
 *               first_page:
 *                 summary: First page of users
 *                 value:
 *                   success: true
 *                   message: "Retrieved 20 users"
 *                   count: 20
 *                   totalUsers: 45
 *                   users:
 *                     - _id: "60d5ec49f1a2c8b1f8e4e1a0"
 *                       name: "John Doe"
 *                       familyName: "MFURA"
 *                       email: "john@example.com"
 *                       birthday: "1990-05-15T00:00:00.000Z"
 *                       subFam: "TestFamily"
 *                       profilePic: "https://res.cloudinary.com/demo/image/upload/profile.jpg"
 *                       profilePicUrl: "https://res.cloudinary.com/demo/image/upload/profile.jpg"
 *                       createdAt: "2024-01-15T10:30:00.000Z"
 *                   pagination:
 *                     currentPage: 1
 *                     totalPages: 3
 *                     totalUsers: 45
 *                     usersPerPage: 20
 *                     hasNextPage: true
 *                     hasPrevPage: false
 *       400:
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Page number must be greater than 0"
 *       403:
 *         description: Access denied - Members and Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/api/users', roleAuth, requireMemberOrAdmin, getAllUsers)


/**
 * @swagger
 * /api/users/{id}/delete:
 *   delete:
 *     summary: Delete user profile (Admins only)
 *     description: Permanently delete a user profile from the database. Only authenticated administrators can access this endpoint. This action cannot be undone.
 *     tags: [Admin Portal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: The unique identifier of the user to delete
 *         example: "60d5ec49f1a2c8b1f8e4e1a0"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User John Doe (MFURA) has been successfully deleted"
 *                 deletedUser:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d5ec49f1a2c8b1f8e4e1a0"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     familyName:
 *                       type: string
 *                       example: "MFURA"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *             examples:
 *               successful_deletion:
 *                 summary: User successfully deleted
 *                 value:
 *                   success: true
 *                   message: "User John Doe (MFURA) has been successfully deleted"
 *                   deletedUser:
 *                     id: "60d5ec49f1a2c8b1f8e4e1a0"
 *                     name: "John Doe"
 *                     familyName: "MFURA"
 *                     email: "john@example.com"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_id:
 *                       value: "User ID is required"
 *                     invalid_format:
 *                       value: "Invalid user ID format"
 *       403:
 *         description: Access denied - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to delete user"
 */
router.delete('/api/users/:id/delete', roleAuth, requireAdmin, deleteUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (Admins only)
 *     description: Retrieve a specific user's profile information by their unique identifier. Only authenticated administrators can access this endpoint.
 *     tags: [Admin Portal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         description: The unique identifier of the user to retrieve
 *         example: "60d5ec49f1a2c8b1f8e4e1a0"
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User Found"
 *                 profilePic:
 *                   type: string
 *                   description: User's profile picture URL or filename
 *                   example: "https://res.cloudinary.com/demo/image/upload/profile.jpg"
 *                 familyName:
 *                   type: string
 *                   description: User's family name
 *                   example: "MFURA"
 *                 name:
 *                   type: string
 *                   description: User's full name
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: User's email address
 *                   example: "john@example.com"
 *             examples:
 *               successful_retrieval:
 *                 summary: User successfully retrieved
 *                 value:
 *                   success: true
 *                   message: "User Found"
 *                   profilePic: "https://res.cloudinary.com/demo/image/upload/profile.jpg"
 *                   familyName: "MFURA"
 *                   name: "John Doe"
 *                   email: "john@example.com"
 *       400:
 *         description: Invalid input or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_id:
 *                       value: "User ID is required"
 *                     invalid_format:
 *                       value: "Invalid user ID format"
 *                     user_not_found:
 *                       value: "User not found!"
 *       403:
 *         description: Access denied - Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve user"
 */
router.get('/api/users/:id', roleAuth, requireAdmin, getUser);

/**
 * @swagger
 * /api/profile/update:
 *   put:
 *     summary: Update own profile (Members & Admins)
 *     description: Update your own profile information including name, email, birthday, subFam, and profile picture. Both authenticated members and administrators can update their own profiles. Supports both file upload and URL-based profile picture updates.
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: "John Doe Updated"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john.updated@example.com"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: User's birthday
 *                 example: "1990-05-15"
 *               subFam:
 *                 type: string
 *                 description: User's sub-family
 *                 example: "UpdatedFamily"
 *               profilePic:
 *                 type: string
 *                 description: Profile picture URL (if not uploading file)
 *                 example: "https://res.cloudinary.com/demo/image/upload/updated-profile.jpg"
 *               profilePicFile:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file upload
 *           examples:
 *             with_file_upload:
 *               summary: Update with file upload
 *               value:
 *                 name: "John Doe Updated"
 *                 email: "john.updated@example.com"
 *                 birthday: "1990-05-15"
 *                 subFam: "UpdatedFamily"
 *             with_url:
 *               summary: Update with profile picture URL
 *               value:
 *                 name: "John Doe Updated"
 *                 email: "john.updated@example.com"
 *                 birthday: "1990-05-15"
 *                 subFam: "UpdatedFamily"
 *                 profilePic: "https://res.cloudinary.com/demo/image/upload/updated-profile.jpg"
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 example: "John Doe Updated"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "john.updated@example.com"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: User's birthday
 *                 example: "1990-05-15"
 *               subFam:
 *                 type: string
 *                 description: User's sub-family
 *                 example: "UpdatedFamily"
 *               profilePic:
 *                 type: string
 *                 description: Profile picture URL
 *                 example: "https://res.cloudinary.com/demo/image/upload/updated-profile.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Your profile has been successfully updated"
 *                 data:
 *                   $ref: '#/components/schemas/Profile'
 *                 updatedFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of fields that were updated
 *                   example: ["name", "email", "profilePic"]
 *             examples:
 *               successful_update:
 *                 summary: Profile successfully updated
 *                 value:
 *                   success: true
 *                   message: "Your profile has been successfully updated"
 *                   data:
 *                     _id: "60d5ec49f1a2c8b1f8e4e1a0"
 *                     name: "John Doe Updated"
 *                     familyName: "MFURA"
 *                     email: "john.updated@example.com"
 *                     birthday: "1990-05-15T00:00:00.000Z"
 *                     subFam: "UpdatedFamily"
 *                     profilePic: "https://res.cloudinary.com/demo/image/upload/updated-profile.jpg"
 *                     profilePicUrl: "https://res.cloudinary.com/demo/image/upload/updated-profile.jpg"
 *                     createdAt: "2024-01-15T10:30:00.000Z"
 *                     updatedAt: "2024-01-20T15:45:00.000Z"
 *                   updatedFields: ["name", "email", "subFam", "profilePic"]
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   examples:
 *                     missing_token:
 *                       value: "Family name not found in token"
 *                     validation_error:
 *                       value: "name must be at least 2 characters long"
 *                     invalid_image:
 *                       value: "Only image files are allowed for profilePic"
 *                     empty_profile_pic:
 *                       value: "profilePic must not be empty"
 *                     invalid_url:
 *                       value: "profilePic must be an absolute URL (https://...) when no file is uploaded"
 *       403:
 *         description: Access denied - Members and Admins only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Profile not found. Please create a profile first."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to update profile"
 */
router.put('/api/profile/update', roleAuth, requireMemberOrAdmin, fileUpload.single('profilePic'), updateProfile);

module.exports = router;
