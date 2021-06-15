const http = require("http");
const fs = require('fs').promises;

const port = '8000';

var Messages = [];
var NumOfMessages = 0;

const requestListener = function (req, res) {
    console.log(
        `Request: ${req.method}, ${req.url}`
    );
    let IsMsg = false;
    let fileName;
    let contentType;


    if (req.url === "/") {
        fileName = "index.html";
        contentType = "text/html";
    }
    else if (req.url.endsWith(".css")) {
        fileName = req.url.substr(1);
        contentType = "text/css";
    }
    else if (req.url === "/GetMessage") {
        IsMsg = true;
        res.writeHead(200);
        res.end(JSON.stringify(Messages));
        console.log("Getting messages from user...");
    }
    else if (req.url === "/SendNewMessage") {
        IsMsg = true;
        res.writeHead(200);
        let data = "";
        req.on('data', (chunk) => {
            data += chunk.toString();
        })
        req.on('end', () => {
            console.log(`Recieved message: ${data}`);
            if (data !== "") {
                Message = data;
                Messages[NumOfMessages++] = data;
            }
            res.end();
        })
        console.log(
            `Request headers: ${JSON.stringify(req.headers)}`
        );
        return;
    }
    else {
        res.writeHead(500);
        res.end("Error, unsupported");
        return;
    }

    if (!IsMsg) {
        fs.readFile(`${__dirname}/${fileName}`)
            .then(contents => {
                res.setHeader("Content-Type", contentType);
                res.writeHead(200);
                res.end(contents.toString());
            })
            .catch(err => {
                res.writeHead(500);
                res.end(err.message);
                return;
            });
    }
};

const server = http.createServer(requestListener);
server.listen(port);