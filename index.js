const { IotServer } = require('./iot_server/IotServer')
const { RelayController } = require('./device_controllers/RelayController')
const { MotionSensorController } = require('./device_controllers/MotionSensorController')
const { SoilController } = require('./device_controllers/SoilController')

const { devices } = require('./data/devices')

let iotControllers = []

devices.forEach(device => {
    let type = device.type
    switch (true) {
        case type === 'relay':
            iotControllers.push(new RelayController(device.ip, device.port, device.name, device.top, device.left))
            break;
        case type === 'motionsensor':
            iotControllers.push(new MotionSensorController(device.ip, device.port, device.name, device.top, device.left))
            break;
        case type === 'soilsensor':
            iotControllers.push(new SoilController(device.ip, device.port, device.name, device.top, device.left))
            break;
    }
})

let server = new IotServer(iotControllers);
server.init()
