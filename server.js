const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public_html'));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/chatty', { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000, });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const Schema = mongoose.Schema;
const ChatMessageSchema = new Schema({
  time: Number,
  alias: String,
  message: String
});

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);

app.get('/chats', async (req, res) => {
    try {
      const messages = await ChatMessage.find().sort({ time: 1 });
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  app.post('/chats/post', async (req, res) => {
    const { alias, message } = req.body;
    const time = Date.now();
    
    const newMessage = new ChatMessage({ time, alias, message });
  
    try {
      await newMessage.save();
      res.sendStatus(200);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  async function clearDatabase() {
    try {
      await ChatMessage.deleteMany({});
    } catch (error) {
      console.error(error);
    }
  }
  clearDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});