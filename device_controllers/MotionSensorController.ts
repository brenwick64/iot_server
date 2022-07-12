const moment = require('moment')
import { DeviceController } from "./DeviceController";
import { IMotionSensor } from "../definitions/IMotionSensor";


export class MotionSensorController extends DeviceController implements IMotionSensor {
    status: string
    type: string
    lastActive: string
    timeStamps: Array<string>
    activeLog: Array<string>

    constructor(ip: string, port: number, name: string, top: string, left: string) {
        super(ip, port, name, top, left)
        this.status = 'inactive'
        this.type = 'motionsensor'
        this.lastActive = ''
        this.timeStamps = []
        this.activeLog = []
    }

    turn_on(): void {
        this.status = 'active'
        this.lastActive = moment().format('LLL')
        this.timeStamps.push(moment().format('LLL'))

        // Limits this log to an array of the 3 most recent timestamps
        this.activeLog = this.timeStamps.slice(Math.max(this.timeStamps.length - 3, 0));
    }

    turn_off(): void {
        this.status = 'inactive'
    }

    getState(): Object {
        const state = {
            name: this.name,
            top: this.top,
            left: this.left,
            status: this.status,
            type: this.type,
            connected: this.connected,
            lastActive: this.lastActive,
            activeLog: this.activeLog
        }
        return state
    }
}