const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const userRoutes = require('./routes/userRoute');
const setupSwagger = require('./config/swagger');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Setup Swagger
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
