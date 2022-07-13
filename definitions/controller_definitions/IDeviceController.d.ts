export interface IDeviceController {
    connected: boolean
    ip: string,
    port: number,
    name: string,
    top: string,
    left: string,
    iotSocket: any
    webSocket: any

    connectWs: () => void
    updateWs: () => void
    connectDevice: () => void
    reconnectDevice: () => void
    getState: () => Object
    handleCommand: (command: string) => void
}