import express from 'express';
import bcrypt from 'bcrypt';
import db from './db.mjs';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateRequest = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('phoneNumber').isNumeric().withMessage('Phone number must be numeric').notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];
router.post('/register', validateRequest, (req, res) => {
    const { firstName, lastName, middleName, age, placeOfBirth, email, phoneNumber, streetAddress, password } = req.body;
    
    const checkUserQuery = 'SELECT COUNT(*) AS userCount FROM users';
    db.query(checkUserQuery, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Server error' });
        }

        const userCount = results[0].userCount;

        const userRole = userCount === 0 ? 'admin' : 'ordinary';

        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkEmailQuery, [email], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Server error' });
            }

            if (results.length > 0) {
                return res.status(409).json({ error: 'Email address already exists' });
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Server error' });
                }
                const insertUserQuery = `INSERT INTO users 
                    (
                        first_name, 
                        last_name, 
                        middle_name, 
                        age, 
                        place_of_birth, 
                        email, 
                        phone_number, 
                        street_address,
                        password, 
                        role, 
                        created_at, 
                        updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

                const values = [firstName, lastName, middleName, age, placeOfBirth, email, phoneNumber, streetAddress, hashedPassword, userRole];

                db.query(insertUserQuery, values, (error, result) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ error: 'Server error' });
                    }
                    res.status(201).json({ message: 'Registration successful' });
                });
            });
        });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const getUserQuery = 'SELECT * FROM users WHERE email=?';
    db.query(getUserQuery, [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Server error' });
        }
        if (results.length == 0) {
            return res.status(400).json({auth: false, error: 'Invalid Email or Password' });
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({auth: false, error: 'Server error' });
            }
            if (result) {
                res.status(200).json({auth: true, activeUser: user });
            } else {
                return res.status(400).json({auth: false, error: 'Invalid Email or Password' });
            }
        })
    })
})

export default router;
