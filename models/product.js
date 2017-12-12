
import db from '../database/db';


const productSchema = db.Schema({
    title: String,
    reviews: Array
});
const product = db.model('production', productSchema);

export default product;