const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const setupSwagger = require('./config/swagger');
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoute'); // Assurez-vous que le chemin est correct

app.use(express.json());

app.use('/api/user', userRoutes);

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

// Setup Swagger
setupSwagger(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
