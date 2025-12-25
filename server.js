const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
// Replace <db_password> with your actual password in the string below
const MONGO_URI = "mongodb+srv://ajitapatel1707_db_user:ajita2006@cluster0studentmanagerd.y1kyuce.mongodb.net/?appName=Cluster0studentmanagerdb";

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected... ✅'))
    .catch(err => console.log('Connection Error: ', err));

// --- MONGODB MODEL ---
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);

// --- ROUTES ---

// 1. GET API - Fetch all notes from MongoDB
app.get('/api/notes', async (req, res) => {
    try {
        const allNotes = await Note.find();
        res.json(allNotes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notes", error: err });
    }
});

// 2. POST API - Create a new note in MongoDB
app.post('/api/notes', async (req, res) => {
    try {
        const newNote = new Note({
            title: req.body.title,
            content: req.body.content
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: "Error creating note", error: err });
    }
});

// 3. PUT API - Update an existing note in MongoDB
app.put('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNote = await Note.findByIdAndUpdate(id, req.body, { new: true });
        
        if (updatedNote) {
            res.json({ message: "Note updated successfully!", updatedNote });
        } else {
            res.status(404).json({ message: "Note not found" });
        }
    } catch (err) {
        res.status(400).json({ message: "Error updating note", error: err });
    }
});

// 4. DELETE API - Remove a note from MongoDB
app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNote = await Note.findByIdAndDelete(id);
        
        if (deletedNote) {
            res.json({ message: "Note deleted successfully!" });
        } else {
            res.status(404).json({ message: "Note not found" });
        }
    } catch (err) {
        res.status(400).json({ message: "Error deleting note", error: err });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});