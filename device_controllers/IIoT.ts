import { timeStamp } from "console";

// Connects to IoT Embedded System
var net = require('net')

// Connects to IoT Webserver
const WebSocket = require('ws');


class Device implements IDevice {
    connected: boolean
    ip: string
    port: number
    name: string
    top: string
    left: string
    iotSocket: any
    webSocket: any

    constructor(ip: string, port: number, name: string, top: string, left: string) {
        this.connected = false
        this.ip = ip
        this.port = port
        this.name = name
        this.top = top
        this.left = left
        this.iotSocket = new net.Socket()
        this.webSocket = new WebSocket('ws://192.168.1.79:8000');
    }

    connect() {
        // Connects to server via websocket
        this.webSocket.on('open', () => {
            console.log(`Server attempting to connect to IoT Object - "${this.name}"...`);
            // Will only connect to IoT device if a websocket is established to the server
            this.iotConnection()
        })
        this.webSocket.on('error', (error: string) => {
            console.log(`Error - ${this.name} failed to connect to Server.`);
        })
    }

    updateServer() {
        this.webSocket.send(JSON.stringify({
            type: "message",
            command: "update",
            name: this.name
        }))
    }

    iotConnection() {
        // Pings the socket and tests for a connection drop
        this.iotSocket.setKeepAlive(true, 5000)

        // Connects to IoT Device's socket
        this.iotSocket.connect(this.port, this.ip, () => {
            console.log(`Server successfully connected to "${this.name}" (Device)`)
            this.connected = true
            this.iotSocket.write('0')
            this.updateServer()
        })

        this.iotSocket.on('end', () => {
            console.log('Connection Terminated.');
        })

        this.iotSocket.on('close', () => {
            console.log(`Server terminating websocket for - "${this.name}"`);
            this.connected = false;
            this.updateServer();
        })

        // Gives the IoT Server a command to execute
        this.iotSocket.on('data', (data: any) => {
            let command = data.toString('utf-8');
            this.webSocket.send(JSON.stringify({
                type: "message",
                command: command,
                name: this.name
            }));
        })
        this.iotSocket.on('error', (error: string) => {
            console.log(`Error - Object failed to connect to device: ${this.name}`);
        })
    }

}

export default Device