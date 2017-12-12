import jwt  from 'jsonwebtoken';

const checkToken = () => (req, res, next) => {
    const token = (req.headers.authorization ? req.headers.authorization : '').replace('Token ','');
    const userInfonfo=jwt.verify(token, 'bla bla bla', (err, userInfo) => {
        if(err){
            res.send({
                code: 404,
                message: "Bad Token"
            });
        }else{
            next();
        }
    });
} 

export default checkToken; 