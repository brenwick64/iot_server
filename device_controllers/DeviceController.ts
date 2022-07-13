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

    // Connects controller instance to main websocket server
    connectWs(): void {
        this.webSocket.on('open', () => {
            this.connectDevice()
        })
        this.webSocket.on('error', (error: string) => {
            console.log(`Error - ${this.name} failed to connect to Server.`);
        })
    }

    // Commands the main websocket server to refresh its state
    updateWs(): void {
        this.webSocket.send(JSON.stringify({
            type: "message",
            command: "update",
            name: this.name
        }))
    }

    // Will attempt to reconnect a disconnected websocket indefinitely
    reconnectDevice = (): void => {
        setTimeout(() => {
            console.log(`Controller (${this.name}) - Attempting to connect to Device...`);
            this.iotSocket.removeAllListeners()
            this.connectDevice()
        }, 2000)
    }

    // All device socket connection and configuration
    connectDevice(): void {

        // Establishes connection
        this.iotSocket.connect(this.port, this.ip, () => {
            this.connected = true
            this.iotSocket.write('0')
            console.log(`Controller (${this.name}) - Successfully connected to Device.`)
            this.updateWs()
        })

        // Pings the socket and tests for a connection drop
        this.iotSocket.setKeepAlive(true, 5000)

        // Sends command from device to main websocket server
        this.iotSocket.on('data', (data: any) => {
            let command = data.toString('utf-8');
            this.webSocket.send(JSON.stringify({
                type: "message",
                command: command,
                name: this.name
            }));
        })

        // Disconnection or termination of device socket
        this.iotSocket.on('end', () => {
            this.connected = false
            this.updateWs()
            this.reconnectDevice()
        })
        this.iotSocket.on('close', () => {
            this.connected = false
            this.updateWs()
            this.reconnectDevice()
        })

        // TODO - Error handling + definitions
        this.iotSocket.on('error', (error: string) => {
        })
    }

    abstract getState(): Object
    abstract handleCommand(command: string): void
}