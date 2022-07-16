import { IDeviceData } from "../definitions/data_definitions/IDeviceData"

export const devices: Array<IDeviceData> = [
    { type: 'relay', ip: '192.168.1.200', port: 80, name: 'Office Light', top: '95%', left: '25%' },
    { type: 'relay', ip: '192.168.1.201', port: 80, name: 'TV Lamp', top: '87%', left: '81%' },
    { type: 'relay', ip: '192.168.1.202', port: 80, name: 'Corner Lamp', top: '65%', left: '45%' },
    { type: 'motionsensor', ip: '192.168.1.120', port: 80, name: 'Bedroom Window', top: '7%', left: '60%' },
    { type: 'motionsensor', ip: '192.168.1.121', port: 80, name: 'Balcony Door', top: '23%', left: '70%' },
    { type: 'soilsensor', ip: '192.168.1.220', port: 80, name: 'Bonzai Tree', top: '75%', left: '60%' }
]