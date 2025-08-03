const { jwtDecode } = require('jwt-decode');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { Task, Topic } = require('../../../models/model');

exports.taskInsert = async (req, res) => {
    const { taskToken, task, priority = 'medium', remark = '' } = req.body;

    if (!taskToken || !task) {
        return res.status(400).send({ message: 'Task and token are required' });
    }

    try {
        const decodedToken = jwtDecode(taskToken);
        const topicId = decodedToken.topicId;

        const newTask = new Task({
            taskName: task,
            topicID: topicId,
            priority,
            remark,
        });

        await newTask.save();
        res.status(200).send({ message: 'Task inserted successfully', task: newTask });
    } catch (err) {
        console.error('Error inserting task:', err);
        res.status(500).send({ message: 'Error inserting task' });
    }
};

exports.gettasks = async (req, res) => {
    const topicID = req.user.topicId;

    try {
        const tasks = await Task.find({ topicID }).sort({ 
            priority: -1, // High priority first
            createdAt: -1 // Newest first
        });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found" });
        }

        res.status(200).send({ data: tasks });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send({ message: 'Error fetching tasks' });
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


exports.toggleTaskComplete = async (req, res) => {
    const taskID = req.params.id;

    try {
        const task = await Task.findOne({ taskID });
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        task.completed = !task.completed;
        task.updatedAt = new Date();
        await task.save();

        res.status(200).send({ 
            message: 'Task status updated', 
            completed: task.completed 
        });
    } catch (err) {
        console.error('Error toggling task:', err);
        res.status(500).send({ message: 'Error updating task status' });
    }
};


exports.updateTask = async (req, res) => {
    const taskID = req.params.id;
    const { taskName, priority } = req.body;

    try {
        const task = await Task.findOne({ taskID });
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        task.taskName = taskName || task.taskName;
        task.priority = priority || task.priority;
        task.updatedAt = new Date();
        await task.save();

        res.status(200).send({ 
            message: 'Task updated successfully', 
            task 
        });
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send({ message: 'Error updating task' });
    }
};


exports.updateRemark = async (req, res) => {
    const taskID = req.params.id;
    const { remark } = req.body;

    try {
        const task = await Task.findOne({ taskID });
        if (!task) {
            return res.status(404).send({ message: 'Task not found' });
        }

        task.remark = remark;
        task.updatedAt = new Date();
        await task.save();

        res.status(200).send({ 
            message: 'Remark updated successfully', 
            task 
        });
    } catch (err) {
        console.error('Error updating remark:', err);
        res.status(500).send({ message: 'Error updating remark' });
    }
};

exports.deleteTask = async (req, res) => {
    const taskID = req.params.id;

    try {
        const result = await Task.deleteOne({ taskID });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'Task not found' });
        }

        res.status(200).send({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send({ message: 'Error deleting task' });
    }
};

exports.clearCompletedTasks = async (req, res) => {
    const topicID = req.user.topicId;

    try {
        const result = await Task.deleteMany({ 
            topicID, 
            completed: true 
        });

        res.status(200).send({ 
            message: 'Completed tasks cleared', 
            deletedCount: result.deletedCount 
        });
    } catch (err) {
        console.error('Error clearing completed tasks:', err);
        res.status(500).send({ message: 'Error clearing completed tasks' });
    }
};
