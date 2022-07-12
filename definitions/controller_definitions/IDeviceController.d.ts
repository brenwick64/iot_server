export interface IDeviceController {
    connected: boolean
    ip: string,
    port: number,
    name: string,
    top: string,
    left: string,
    iotSocket: any
    webSocket: any

    connect: () => void
    updateServer: () => void
    iotConnection: () => void
    getState: () => Object
    handleCommand: (command: string) => void
}