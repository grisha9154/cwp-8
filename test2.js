const net = require('net');

const client = new net.Socket();
client.setEncoding('utf-8');

client.connect('2000','localhost',function () {
    let value ={
        method:'delete',
        id:0
    };
    client.write(JSON.stringify(value));
});
client.on('data',(data)=>{
    data = JSON.parse(data);
    switch (data.type){
        case 'kill':{
            console.log(data);
        }break;
        case 'DEC':client.end();break;
    }
});
client.on('close',()=>{
    console.log("End");
});