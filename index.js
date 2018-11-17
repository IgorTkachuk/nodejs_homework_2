const http = require('http');
const port = 3000;
const intervalToFin = 20 * 1000;
let clientCounter = 0;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        let startTime = new Date().getTime();
        let clientId = clientCounter++;

        const interval = setInterval(() => {
            const realTime = new Date().getTime();
            const exTime = realTime - startTime;
            let time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log(`${clientId}\t${time}\t${exTime}`);

            if(exTime > intervalToFin) {
                res.end(time);
                clearInterval(interval);
            }

        }, 
        1 * 1000);
    } else {
        res.end();
    }
});

server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});