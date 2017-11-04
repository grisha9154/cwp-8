const net = require('net');

exports.remove = function (req, res, payload) {
    const client = new net.Socket();
    client.setEncoding('utf-8');

    client.connect('2000','localhost',function () {
        let value ={
            method:'delete',
            id:payload.id
        };
        client.write(JSON.stringify(value));
    });
    client.on('data',(data)=>{
        data = JSON.parse(data);
        switch (data.type){
            case 'kill':{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/JSON');
                res.end(JSON.stringify(data));
            }break;
            case 'DEC':client.end();
            break;
        }
    });
    client.on('close',()=>{
        console.log("End");
    });
};
