import db from '../database/db';

const userSchema = db.Schema({
    name: String,
    password: String
});

const user = db.model('user', userSchema);

export default user;