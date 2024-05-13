import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import taskRouter from './router/TaskRouter';
import boardRouter from './router/BoardRouters';
import columnRouter from './router/ColumnRouter';
import subTaskRouter from './router/SubTaskRouter';

const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config();
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/api', (req, res, next) => {
  res.status(200).json({ message: 'Hello World' });
  next();
});
app.use('/api', taskRouter);
app.use('/api', boardRouter);
app.use('/api', columnRouter);
app.use('/api', subTaskRouter);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const CONNECTION_URL = process.env.CONNECTION_URI;

mongoose.Promise = Promise;
mongoose.connect(CONNECTION_URL);
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB', err);
});
