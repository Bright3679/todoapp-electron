const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const sql = require("mssql")

async function executeQuery(query, params) {
    try {
        const request = pool?.request();
        if (params) {
            for (const key in params) {
                request.input(key, params[key]);
            }
        }
        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        throw new Error(err);
    }
}

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
        const existingUser = await executeQuery('SELECT * FROM Persons WHERE name = @username AND emailID = @emailid', { username, emailid });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sessionId = uuidv4();
        await executeQuery(
            'INSERT INTO Persons (name, password, emailID, personID) VALUES (@username, @hashedPassword ,@emailid ,@sessionId)',
            { username, hashedPassword, emailid, sessionId }
        );

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
        const user = await executeQuery('SELECT * FROM Persons WHERE name = @usernameOremailid OR emailID = @usernameOremailid', { usernameOremailid });
        if (user.length === 0) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user[0].password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid Password' });
        }

        const token = jwt.sign(
            {
                personID: user[0].personID,
                name: user[0].name
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
    let userId = req.user.personID;
    let username = req.user.name;
    try {
        const query = 'SELECT * FROM Persons WHERE personID = @userId AND name = @username';
        const userDetails = await executeQuery(query, { userId, username });

        if (userDetails.length === 0) {
            return res.status(404).json({ message: 'User details not found' });
        }

        res.json({ data: userDetails });
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
        const checkEmail = 'SELECT personID FROM Persons WHERE emailID = @email';

        const result = await executeQuery(checkEmail, { email });

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'Email not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatePassword = 'UPDATE Persons SET password = @hashedPassword WHERE emailID = @email';

        await executeQuery(updatePassword, { hashedPassword, email });

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('SQL error', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
