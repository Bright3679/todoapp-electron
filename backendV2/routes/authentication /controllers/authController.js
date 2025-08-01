const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../../../models/model');

exports.register = async (req, res) => {
    const { username, password, emailid } = req.body;
    
    if (!username || !password || !emailid) {
        return res.status(400).json({ message: 'Username, Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailid)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        
        const existingUser = await User.findOne({ 
            $or: [{ name: username }, { emailID: emailid }]
        });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({
            name: username,
            emailID: emailid,
            password: password
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    const { usernameOremailid, password } = req.body;
    
    if (!usernameOremailid || !password) {
        return res.status(400).json({ message: 'Username/email and password are required' });
    }

    try {
        const user = await User.findOne({
            $or: [{ name: usernameOremailid }, { emailID: usernameOremailid }]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign(
            {
                personID: user.personID,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserDetails = async (req, res) => {
    const userId = req.user.personID;
    const username = req.user.name;

    try {
        const user = await User.findOne({ 
            personID: userId, 
            name: username 
        }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User details not found' });
        }

        res.json({ data: user });
    } catch (err) {
        console.error('Error fetching user details:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.ResetPassword = async (req, res) => {
    const { newPassword, email } = req.body;

    if (!newPassword || !email) {
        return res.status(400).json({ success: false, message: 'New Password and email are required!' });
    }

    try {
        const user = await User.findOne({ emailID: email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email not found' });
        }

        user.password = newPassword; 
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};