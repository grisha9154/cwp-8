const fs =require('fs');
const path = process.argv[2];
const x = process.argv[3];
fs.writeFile(path, "[]",()=> {
    start();
});
function getRandNumber(min,max) {
    return (Math.round(Math.random()*(max-min)+min));
}
function start() {
            setInterval(working,x);
}
function working() {
    const read = fs.createReadStream(path);
    read.on('data',(chunk)=> {
        let value = {number: getRandNumber(0, 1000)};
        let str = JSON.parse(chunk);
        str.push(value);
        const write = fs.createWriteStream(path);
        write.write(JSON.stringify(str));
    });
    read.read();
}