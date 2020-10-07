const net = require('net')
const request = require('request')
const webServer = require('isite')({port:55555 , name : 'auto updating' , apps : false})

var list = []

webServer.all('*', (req, res) => {

    if (list.filter(u => u == req.url).length > 0) {
        res.end()
        return
    }

    list.push(req.url)

    request({
        url: req.url,
        method: req.method,
        headers: req.headers,
        body: req.bodyRaw
    }).on('error', function (e) {
        res.end()
        for (let i = 0; i < list.length; i++) {
            if (list[i] == req.url) {
                list.splice(i, 1)
            }
        }
    }).pipe(res).on('finish', () => {
        for (let i = 0; i < list.length; i++) {
            if (list[i] == req.url) {
                list.splice(i, 1)
            }
        }
    })

})

var server = webServer.run()


var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

var getHostPortFromString = function (hostString, defaultPort) {
    var host = hostString;
    var port = defaultPort;

    var result = regex_hostport.exec(hostString);
    if (result != null) {
        host = result[1];
        if (result[2] != null) {
            port = result[3];
        }
    }

    return ([host, port]);
};

server.addListener('connect', function (req, socket, bodyhead) {

    var hostPort = getHostPortFromString(req.url, 443);
    var hostDomain = hostPort[0];
    var port = parseInt(hostPort[1]);

    var proxySocket = new net.Socket();

    proxySocket.connect(port, hostDomain, function () {
        proxySocket.write(bodyhead);
        socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
    })

    proxySocket.on('data', function (chunk) {
        socket.write(chunk);
    });

    proxySocket.on('end', function () {
        socket.end()
    })

    proxySocket.on('error', function () {
        socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n")
        socket.end()
    })

    socket.on('data', function (chunk) {
        proxySocket.write(chunk)
    })

    socket.on('end', function () {
        proxySocket.end()
    })

    socket.on('error', function () {
        proxySocket.end();
    })


})
