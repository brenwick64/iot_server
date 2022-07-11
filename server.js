// **************************** IMPORTS *******************************

// WSS Server Config
const port = process.env.PORT || 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

// Local Imports


// ********************** IoT Device Management ************************




// *********************** HELPER FUNCTIONS ****************************

// Generates unique userid for each client connection
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4()
};


// TODO- make this functional
// Lists
var iotDevicesState = []
var iotDevices = []

const updateIotState = () => {
    iotDevicesState = [];
    iotDevices.map(device => {
        if (device.connected) {
            iotDevicesState.push(device.getState())
        }
    })
}











// ********************* WS SERVER CONFIGURATION ***********************

//Creates Websocket server and listens for connections
const server = http.createServer()
server.listen(port)
console.log(`websocket server listening on port: ${port}`);
const wsServer = new webSocketServer({
    httpServer: server
});
const clients = {};



wsServer.on('request', (request) => {
    // Generate user ID
    var userID = getUniqueID();

    // Creates a new socket connection
    const connection = request.accept(null, request.origin)
    clients[userID] = connection

    connection.sendUTF(JSON.stringify(iotDevicesState))
    connection.on('message', (message) => {

        // Ignore incorrectly formatted messages
        if (message.type === 'utf8') {

            let name = JSON.parse(message.utf8Data).name
            let command = JSON.parse(message.utf8Data).command
            // commandHandler(name, command)
            // updateIotState()

            // Send updated state information to client after  every command
            for (key in clients) {
                clients[key].sendUTF(JSON.stringify(iotDevicesState));
            }
        }
    });
});



