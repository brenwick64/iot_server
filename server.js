// **************************** IMPORTS *******************************

// WSS Server Config
const port = process.env.PORT || 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

// Local Imports
const { RelayController } = require('./device_controllers/RelayController')
const { MotionSensorController } = require('./device_controllers/MotionSensorController')
const { SoilController } = require('./device_controllers/SoilController')


// ********************** IoT Device Management ************************


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



// Lists
var iotDevicesState = []
var iotDevices = []

// Relays - IP + 200
iotDevices.push(new RelayController('192.168.1.200', '80', 'Office Light', '95%', '25%'));
iotDevices.push(new RelayController('192.168.1.201', '80', 'TV Lamp', '87%', '81%'));
iotDevices.push(new RelayController('192.168.1.202', '80', 'Corner Lamp', '65%', '45%'));

// Motion Sensors - IP + 120
iotDevices.push(new MotionSensorController('192.168.1.120', '80', 'Bedroom Window', '7%', '60%'));
iotDevices.push(new MotionSensorController('192.168.1.121', '80', 'Balcony Door', '23%', '70%'));

// Soil Sensors - IP + 220
iotDevices.push(new SoilController('192.168.1.220', '80', 'Bonzai Tree', '75%', '60%'));


// Connect to devices and set initial state
iotDevices.map(device => { device.connect() });
updateIotState()



// ************************** COMMAND HANDLING ***************************

function commandHandler(name, command) {
    var currentIoT;
    iotDevices.map(device => {
        if (device.name === name) {
            currentIoT = device

            switch (true) {
                case command === 'off':
                    currentIoT.turn_off()
                    break;

                case command === 'on':
                    currentIoT.turn_on()
                    break;

                case command === 'toggle':
                    currentIoT.toggle()
                    break;

                //TODO: Fix this band-aid solution by allowing more data to be passed by IoT devices
                case (command === 'wet' || command === 'dry' || command === 'moist' || command === 'damp'):
                    currentIoT.set_soil_status(command);
                    break;
            }
        }
    })
}


// *********************** HELPER FUNCTIONS ****************************

// Generates unique userid for each client connection
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4()
};


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
            commandHandler(name, command)
            updateIotState()

            // Send updated state information to client after  every command
            for (key in clients) {
                clients[key].sendUTF(JSON.stringify(iotDevicesState));
            }
        }
    });
});



