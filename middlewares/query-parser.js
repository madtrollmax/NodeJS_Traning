const queryParser = () => (req, res, next) => {
    req.parsedQuery = {};

    const query = req.url.split('?')[1];
    if(query){
        query.split('&').forEach(elem=> {
            const arr = elem.split('=').map(el => el.trim());
            req.parsedQuery[arr[0]]=arr[1];
        })
    }
    next();
}

export default queryParser; 