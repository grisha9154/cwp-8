const http =  require('http');
const worker = require('./handlers/workers.js');
const add = require('./handlers/add.js');
const remove = require('./handlers/remove.js');

const handlers = {
    '/workers':worker.workers,
    '/workers/add':add.add,
    '/workers/remove':remove.remove
};

const hostname = '127.0.0.1';
const port =3000;

const server = http.createServer((req,res)=>{
    const handler = getHandler(req.url);
    if(handler===undefined)
    {
        const vat = {
            code:"400",
            message:"Request invalid"
        };
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(vat));
        return;
    }
    else{
        parseBodyJson(req, (err, payload) => {
            handler(req, res,payload);
        });
    }
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
    if(handlers[url]==undefined){
        return undefined
    }else{
        return handlers[url];
    }
}

function parseBodyJson(req, cb) {
    let body = [];
    req.on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        if(body=="")
            body = "{}";
        let params = JSON.parse(body);
        cb(null, params);
    });
}