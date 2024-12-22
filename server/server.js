const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
connectDB();

const app = express();
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your front-end URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable credentials if needed
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('Hello from the backend');
  });

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





