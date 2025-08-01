const { jwtDecode } = require('jwt-decode');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { Task, Topic } = require('../../../models/model');

exports.taskInsert = async (req, res) => {
    const { taskToken, task } = req.body;

    if (!taskToken || !task) {
        return res.status(400).send({ message: 'Enter any Task!' });
    }

    try {
        const decodedToken = jwtDecode(taskToken);
        const topicId = decodedToken.topicId;

        const newTask = new Task({
            taskName: task,
            topicID: topicId
        });

        await newTask.save();

        res.status(200).send({ message: 'Task inserted successfully' });
    } catch (err) {
        console.error('Error inserting task:', err);
        res.status(500).send({ message: 'Error inserting task' });
    }
};

exports.gettasks = async (req, res) => {
    const topicID = req.user.topicId;

    try {
        const tasks = await Task.find({ topicID }).sort({ createdAt: -1 });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.set('Cache-Control', 'no-store');
        return res.status(200).send({ data: tasks });
    } catch (err) {
        console.error("Error showing Data", err);
        res.status(500).send({ message: 'Error showing Data' });
    }
};

exports.createTaskTopic = async (req, res) => {
    const { topicValue, token } = req.body;

    if (!token || !topicValue) {
        return res.status(400).send({ message: 'Create any Topic!' });
    }

    try {
        const decodedToken = jwtDecode(token);
        const personID = decodedToken.personID;

        if (!personID) {
            return res.status(400).send({ message: 'Invalid token' });
        }

        // Check if topic already exists for this user
        const existingTopic = await Topic.findOne({ 
            topicName: topicValue, 
            personID 
        });

        if (existingTopic) {
            return res.status(400).send({ message: 'Topic already exists' });
        }

        const newTopic = new Topic({
            topicName: topicValue,
            personID
        });

        await newTopic.save();

        const taskToken = jwt.sign(
            { topicId: newTopic.topicID },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).send({ 
            message: 'Topic created successfully', 
            taskToken 
        });
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).send({ message: 'Error creating topic' });
    }
};

exports.getTopicsName = async (req, res) => {
    const personID = req.user.personID;

    try {
        const topics = await Topic.find({ personID })
            .sort({ createdAt: -1 })
            .select('topicName');

        if (topics.length === 0) {
            return res.status(404).json({ message: "No topics found" });
        }

        res.set('Cache-Control', 'no-store');
        return res.status(200).send({ data: topics });
    } catch (error) {
        console.error("Error fetching topics:", error);
        res.status(500).send({ message: 'Error fetching topics' });
    }
};