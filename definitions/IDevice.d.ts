interface IDevice {
    connected: boolean
    ip: string,
    port: number,
    name: string,
    top: string,
    left: string,
    iotSocket: any
    webSocket: any

    connect: () => void






}