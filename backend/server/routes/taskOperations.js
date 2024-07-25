const { jwtDecode } = require('jwt-decode');
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

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

exports.taskInsert = async (req, res) => {
    const { taskToken, task } = req.body;

    if (!taskToken || !task) {
        return res.status(400).send({ message: 'Enter any Task!' });
    }

    try {
        const decodedToken = jwtDecode(taskToken);
        const topicId = decodedToken.topicId;
        const taskID = uuidv4();

        await executeQuery(
            'INSERT INTO Tasks (taskID, taskName, topicID) VALUES (@taskID, @task, @topicId)',
            { taskID, task, topicId }
        );

        res.status(200).send({ message: 'Task inserted successfully' });
    } catch (err) {
        console.error('Error inserting task:', err);
        res.status(500).send({ message: 'Error inserting task' });
    }
};

exports.gettasks = async (req, res) => {
    let topicID = req.user.topicId;
    try {
        const query =
            'SELECT * FROM Tasks WHERE topicID = @topicID';
        ;
        const taskDetails = await executeQuery(query, { topicID })

        if (taskDetails.length === 0) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.set('Cache-Control', 'no-store');
        return res.status(200).send({ data: taskDetails });

    } catch (err) {
        console.error("Error showing Data", err);
        res.status(500).send({ message: 'Error showing Data' })
    }
}

exports.createTaskTopic = async (req, res) => {
    let { topicValue, token } = req.body;

    if (!token || !topicValue) {
        return res.status(400).send({ message: 'Create any Topic!' });
    }
    try {
        const decodedToken = jwtDecode(token);
        const PersonID = decodedToken.personID;
        const topicId = uuidv4();

        if (!PersonID) {
            return res.status(400).send({ message: 'Invalid token' });
        }

        const existingTopic = await executeQuery('SELECT topicName FROM todoTopics WHERE topicName = @topicValue AND personID = @personID', {
            topicValue, PersonID
        });

        if (existingTopic.length > 0) {
            return res.status(400).send({ message: 'Topic already exists' });
        }

        await executeQuery('INSERT INTO todoTopics (topicID, topicname, personID) VALUES (@topicId, @topicValue, @PersonID)', {
            topicId, topicValue, PersonID
        })
        const taskToken = jwt.sign(
            {
                topicId: topicId
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.status(200).send({ message: 'Task inserted successfully', taskToken });

    } catch (error) {
        console.error('Error inserting task:', error);
        res.status(500).send({ message: 'Error inserting task' });
    }
}

exports.getTopicsName = async (req, res) => {
    let personID = req.user.personID;

    try {
        const data = await executeQuery('SELECT topicName FROM todoTopics WHERE personID = @personID', { personID });
        if (data.length === 0) {
            return res.status(404).json({ message: "Task not found" })
        }

        res.set('Cache-Control', 'no-store');
        return res.status(200).send({ data: data });
    } catch (error) {
        console.error("Error showing Data", error);
        res.status(500).send({ message: 'Error showing Data' })
    }
}
