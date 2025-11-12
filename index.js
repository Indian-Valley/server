const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router.js');

const local = true

const app = express();
const URL = local? "https://localhost" : "https://indian-valley-server.onrender.com";
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(router)

app.listen(PORT, () => {
    console.log(`Server is running on ${URL}:${PORT}`);
});