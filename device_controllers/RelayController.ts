import { DeviceController } from "./DeviceController";
import { IRelayController } from "../definitions/IRelayController";


export class RelayController extends DeviceController implements IRelayController {
    status: string
    type: string

    constructor(ip: string, port: number, name: string, top: string, left: string) {
        super(ip, port, name, top, left)
        this.status = 'off'
        this.type = 'relay'
    }

    turn_on(): void {
        this.iotSocket.write('1')
        this.status = 'on';
    }

    turn_off(): void {
        this.iotSocket.write('0')
        this.status = 'off';
    }

    toggle(): void {
        this.status === 'off' ? this.turn_on() : this.turn_off()
    }

    getState(): Object {
        const state = {
            name: this.name,
            top: this.top,
            left: this.left,
            status: this.status,
            type: this.type,
            connected: this.connected
        }
        return state
    }
}