const cookieParser = () => (req, res, next) => {
    req.parsedCookies = {};
    if(req.headers.cookie){
        req.headers.cookie.split(';').forEach(elem => {
            const arr = elem.split('=').map(el => el.trim());
            req.parsedCookies[arr[0]]=arr[1];
        })
    }
    next();
} 

export default cookieParser; 