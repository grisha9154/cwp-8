const net = require('net');

exports.workers = function (req, res) {
    const client = new net.Socket();
    client.setEncoding('utf-8');
    let value = [];

    client.connect('2000','localhost',function () {
        let value ={
            method:'show'
        };
        client.write(JSON.stringify(value));
    });
    client.on('data',(chunk)=>{
        let data = JSON.parse(chunk);
        switch (data.type){
            case 'show': {
                value.push(data);
            }break;
            case 'DEC': {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/JSON');
                res.end(JSON.stringify(value));
                client.end();
            }break;
        }
    });
    client.on('close',()=>{
        console.log("End");
    });}
