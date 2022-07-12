import { IDeviceController } from "../definitions/controller_definitions/IDeviceController";
require('dotenv').config();

// Connects to IoT Embedded System
var net = require('net')

// Connects to IoT Webserver
const WebSocket = require('ws');


export abstract class DeviceController implements IDeviceController {
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
        this.webSocket = new WebSocket(`ws://${process.env.WEBSOCKET_IP}:${process.env.PORT}`);
    }

    connect(): void {
        // Connects to server via websocket
        this.webSocket.on('open', () => {
            this.iotConnection()
        })
        this.webSocket.on('error', (error: string) => {
            console.log(`Error - ${this.name} failed to connect to Server.`);
        })
    }

    updateServer(): void {
        this.webSocket.send(JSON.stringify({
            type: "message",
            command: "update",
            name: this.name
        }))
    }

    iotConnection(): void {
        // Pings the socket and tests for a connection drop
        this.iotSocket.setKeepAlive(true, 5000)

        // Connects to IoT Device's socket
        this.iotSocket.connect(this.port, this.ip, () => {
            console.log(`(Controller) - successfully connected to "${this.name}" (Device)`)
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
    abstract getState(): Object
    abstract handleCommand(command: string): void
}