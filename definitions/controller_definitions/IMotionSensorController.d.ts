export interface IMotionSensorController {
    status: string
    type: string
    lastActive: string
    timeStamps: Array<string>
    activeLog: Array<string>

    turn_on: () => void
    turn_off: () => void
    getState: () => Object
}