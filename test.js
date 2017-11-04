const net = require('net');

const client = new net.Socket();
client.setEncoding('utf-8');

client.connect('2000','localhost',function () {
   let value ={
       method:'create',
       path:"E:\\Univer\\5 семестр\\ПСКП\\PSKP\\Лабы\\lab8\\worker-files",
       x:1000
   };
   client.write(JSON.stringify(value));
});
client.on('data',(data)=>{
    data = JSON.parse(data);
    switch (data.type){
        case 'create' :{
            console.log(data);
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