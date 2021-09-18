const express = require('express');
const cors = require('cors');
const { getChart } = require('./controllers/linguistChartController');
require('dotenv').config()

const PORT = process.env.PORT || 8090;
const app = express();

app.use(cors());

app.get('/:nickname', getChart);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));