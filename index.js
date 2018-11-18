const http = require('http');
const argv = require('minimist')(process.argv.slice(2));
const port = 3000;
const dfltResHoldInterval = 5;
const dfltTickDuration = 1;
let clientCounter = 0;
let tickDuration, resHoldInterval;

const displayHelp = () => {
    console.log(
        'Usage: node index.js\
        \n\tuse \'-h\' for display this help.\
        \n\tYou can use environment variables:\
        \n\t\t \'TICK_DURATION\' to set time in seconds for display UTC date and time in script console after client request (default 1 sec.)\
        \n\t\t\ \'RES_HOLD_INTERVAL\' to set time in seconds for time hold client final responce (default 5 sec.)\
        \n\nUse <Ctrl + C> for terminate process.\n'
    );
}

const chkParam = () => {
    if (argv.h) {
        displayHelp();
        process.exit(0);
    }

    tickDuration = process.env.TICK_DURATION ? parseInt(process.env.TICK_DURATION) : dfltTickDuration;
    resHoldInterval = process.env.RES_HOLD_INTERVAL ? parseInt(process.env.RES_HOLD_INTERVAL) : dfltResHoldInterval;

    console.log(`Starting with parameters: tick duration = ${tickDuration} sec. and client responce hold interval = ${resHoldInterval} sec.`);
}

chkParam();

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        let startTime = new Date().getTime();
        let clientId = clientCounter++;

        const clientServInterval = setInterval(() => {
            const realTime = new Date().getTime();
            const exTime = realTime - startTime;
            let time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            console.log(`${clientId}\t${time}\t${exTime}`);

            if(exTime > (resHoldInterval * 1000)) {
                res.end(time);
                clearInterval(clientServInterval);
            } else {
                res.write(time + '\r\n');
            }

        }, 
        tickDuration * 1000);
    } else {
        res.end();
    }
});

server.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});