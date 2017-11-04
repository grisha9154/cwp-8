const net = require('net');
const cp  = require('child_process');
const fs = require('fs');
const cpArr = [];
const server = net.createServer(getConnectoin);
server.listen(2000,()=>{
    console.log("Start lisn");
});
console.log("Listning on port 2000");

function getConnectoin(conn) {
    console.log("connection");
    conn.on("data",getHandler);
    conn.on("close",getClose);

    function getHandler(data) {
        let value = JSON.parse(data);
        switch (value.method){
            case 'create':getData(data);break;
            case 'delete':killProc(data);break;
            case 'show':show();break;
        }
    }
    function show() {
        for(let i=0;i<cpArr.length;i++){
            const reader = fs.createReadStream(cpArr[i].file);
            reader.on('data',(chunk)=>{
                let listOfNumber = JSON.parse(chunk);
                conn.write(JSON.stringify({type:'show',id:i,time:cpArr[i].time,numbers:listOfNumber}));
                if(i===cpArr.length-1)conn.write(JSON.stringify({type:'DEC'}));
            });
            reader.read();
        }
    }
    function killProc(data) {
        let value = JSON.parse(data);

        cpArr[value.id].worker.on('close',()=>{
            const reader = fs.createReadStream(cpArr[value.id].file);
            reader.on('data',(chunk)=>{
                let listOfNumber = JSON.parse(chunk);
                conn.write(JSON.stringify({type:'kill',id:value.id,time:cpArr[value.id].time,numbers:listOfNumber}),()=>{
                    conn.write(JSON.stringify({type:'DEC'}));
                });
            });
            reader.read();
        });
        cpArr[value.id].worker.kill();



    }
    function getData(chunk) {
        let value = JSON.parse(chunk);
        let path = value.path+"\\"+getRandomInt(0,100)+".json";
        let worker = cp.spawn("node",["E:\\Univer\\5 семестр\\ПСКП\\PSKP\\Лабы\\lab8\\worker.js",path,value.x]);
        cpArr.push({time:Date(),worker:worker,file:path});
        conn.write(JSON.stringify({type:'create',id:cpArr.length-1,time:Date()}));
        conn.write(JSON.stringify({type:'DEC'}));
    }
}

function getClose() {
    console.log("client close connection");
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}