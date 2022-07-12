import { IDeviceController } from "../definitions/controller_definitions/IDeviceController";
import { IIotServer } from "../definitions/server_definitions/IIotServer";

// Dependencies
const websocket = require('websocket').server;
const http = require('http');

// Constants
const PORT = process.env.PORT || 8000;


export class IotServer implements IIotServer {
    clients: any
    http: any
    clientServer: any
    iotControllers: Array<IDeviceController>
    iotState: Array<Object>


    constructor(iotControllers: Array<IDeviceController>) {
        // Configures Websocket Client Server
        this.clients = []
        this.http = http.createServer()
        this.clientServer = new websocket({ httpServer: this.http })
        // Stores device data
        this.iotControllers = [...iotControllers]
        this.iotState = []
    }

    init(): void {
        // Server Configuration
        this.http.listen(PORT)
        console.log(`websocket server listening on port: ${PORT}`);

        // Initial Connections
        this.iotControllers.map(device => { device.connect() })
        this.updateIoTState()
        this.runClientServer()
    }

    updateIoTState(): void {
        this.iotState = []
        this.iotControllers.map(device => {
            this.iotState.push(device.getState())
        })
    }


    getUniqueID(): string {
        // Generates unique user ID for each client connection
        const partition = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return partition() + partition() + '-' + partition()
    };


    commandHandler(name: string, command: string) {
        this.iotControllers.map(device => {
            if (device.name === name) { device.handleCommand(command) }
        })
    }

    runClientServer(): void {
        this.clientServer.on('request', (request: any) => {

            // Generate new User ID
            var userID = this.getUniqueID();

            // Creates a new socket connection and sends Up-To-Date State
            const connection = request.accept(null, request.origin)
            this.clients[userID] = connection
            connection.sendUTF(JSON.stringify(this.iotState))

            // Handles messages sent to the IoT Websocket server
            connection.on('message', (message: any) => {

                let name = JSON.parse(message.utf8Data).name
                let command = JSON.parse(message.utf8Data).command

                // Message must include name and command
                if (name && command) {
                    this.commandHandler(name, command)
                    this.updateIoTState()

                    // Updates all clients with up-to-date state
                    for (const key in this.clients) {
                        this.clients[key].sendUTF(JSON.stringify(this.iotState))
                    }
                }
            })
        })
    }
}