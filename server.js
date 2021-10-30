require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const Sequelize = require('sequelize');

//do I need this here since its also already there in connection?
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PW,
    {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306
    });

const force = JSON.parse(process.env.DB_FORCE_SYNC);

sequelize.sync({ force }).then(() => {
    console.log('synced!');
})

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});