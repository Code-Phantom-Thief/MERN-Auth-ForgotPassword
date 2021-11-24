require('dotenv').config();

const express = require('express');
const morgan = require('morgan');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

const authRouter = require('./routes/auth');
const privateRouter = require('./routes/private');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

connectDB();

app.get('/', (req, res) => {
	res
		.status(200)
		.json({ message: 'This API is working!!!' });
});

app.use('/api/auth', authRouter);
app.use('/api/private', privateRouter);

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is runnning on port ${PORT}`);
});
