import Sequelize from 'sequelize';
import db from '../database/db';

const review = db.define('Review', {
    Id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
    ProductionId: {type: Sequelize.BIGINT},
    Review: {type: Sequelize.STRING},
});

export default review;