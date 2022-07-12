import { DeviceController } from "./DeviceController";
import { ISoilController } from "../definitions/ISoilController";

export class SoilController extends DeviceController implements ISoilController {
    type: string
    soilStatus: string

    constructor(ip: string, port: number, name: string, top: string, left: string) {
        super(ip, port, name, top, left)
        this.type = 'soilsensor'
        this.soilStatus = ''
    }

    request_data(): void {
        this.iotSocket.write('1')
    }

    set_soil_status(status: string): void {
        this.soilStatus = status
    }

    getState(): Object {
        const state = {
            name: this.name,
            top: this.top,
            left: this.left,
            type: this.type,
            connected: this.connected,
            soilStatus: this.soilStatus
        }
        return state
    }
}
