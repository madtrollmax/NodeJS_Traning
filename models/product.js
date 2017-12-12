import Sequelize from 'sequelize';
import db from '../database/db';
import review from './review';

const product = db.define('Production', {
    Id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true},
    Title: {type: Sequelize.STRING},
});
product.hasMany(review);

 
export default product;