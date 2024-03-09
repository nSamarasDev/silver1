const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

const app = express()

connectDB()

if( process.env.NODE_ENV  ===  'development' ) {
    app.use(morgan('dev'))
}

app.use(cookieParser());

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/contact', require('./routes/api/contact'));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/post"));
app.use("/api/articles", require("./routes/api/article"));
app.use("/api/uploads", require("./routes/api/upload"));
app.use("/api/downloads", require("./routes/api/download"));

const PORT = process.env.PORT || 6666;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));