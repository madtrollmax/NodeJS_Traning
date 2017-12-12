import db from '../database/db';


const citySchema = db.Schema({
    name: {
        type: String, 
        required: [true, 'Field required']
    },
    country: String,
    capital: Boolean,
    location: {
        lat: Number,
        long: Number
    },
    lastModifiedDate: { type: Date }
});

citySchema.pre('save', function(next){
    var something = this;
    this.lastModifiedDate = Date.now();
    
    next();
});

const city = db.model('cities', citySchema);

export default city;