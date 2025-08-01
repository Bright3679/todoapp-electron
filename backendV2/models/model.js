const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    personID: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    emailID: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});


userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};


const taskSchema = new mongoose.Schema({
    taskID: { type: String, default: uuidv4, unique: true },
    taskName: { type: String, required: true },
    topicID: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});


const topicSchema = new mongoose.Schema({
    topicID: { type: String, default: uuidv4, unique: true },
    topicName: { type: String, required: true },
    personID: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
const Topic = mongoose.model('Topic', topicSchema);

module.exports = { User, Task, Topic };