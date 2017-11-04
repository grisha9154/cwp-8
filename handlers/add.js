const net = require('net');


exports.add = function (req, res, payload) {
const client = new net.Socket();
client.setEncoding('utf-8');

client.connect('2000','localhost',function () {
    let value ={
        method:'create',
        path:"E:\\Univer\\5 семестр\\ПСКП\\PSKP\\Лабы\\lab8\\worker-files",
        x:payload.x
    };
    client.write(JSON.stringify(value));
});
client.on('data',(data)=>{
    data = JSON.parse(data);
    switch (data.type){
        case 'create' :{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/JSON');
            res.end(JSON.stringify(data));
        }
        case 'DEC':
        {
            client.end();
        }break;
    }
});
client.on('close',()=>{
    console.log("End");
});
};