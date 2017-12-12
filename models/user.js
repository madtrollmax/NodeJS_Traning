import Sequelize from 'sequelize';
import db from '../database/db';

const user = db.define('User', {
    Id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
    Name: {type: Sequelize.STRING},
    Password: {type: Sequelize.STRING}
});

export default user;