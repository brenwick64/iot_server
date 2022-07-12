export interface IIotServer {
    clients: any
    http: any
    clientServer: any
    iotControllers: Array<IDeviceController>
    iotState: Array<Object>

    init: () => void
    updateIoTState: () => void
    getUniqueID: () => string
    commandHandler: (name: string, command: string) => void
    runClientServer: () => void
}