const { IotServer } = require('./iot_server/IotServer')
const { RelayController } = require('./device_controllers/RelayController')
const { MotionSensorController } = require('./device_controllers/MotionSensorController')
const { SoilController } = require('./device_controllers/SoilController')

let iotControllers = []

// Relays - IP + 200
iotControllers.push(new RelayController('192.168.1.200', '80', 'Office Light', '95%', '25%'));
iotControllers.push(new RelayController('192.168.1.201', '80', 'TV Lamp', '87%', '81%'));
iotControllers.push(new RelayController('192.168.1.202', '80', 'Corner Lamp', '65%', '45%'));

// Motion Sensors - IP + 120
iotControllers.push(new MotionSensorController('192.168.1.120', '80', 'Bedroom Window', '7%', '60%'));
iotControllers.push(new MotionSensorController('192.168.1.121', '80', 'Balcony Door', '23%', '70%'));

// Soil Sensors - IP + 220
iotControllers.push(new SoilController('192.168.1.220', '80', 'Bonzai Tree', '75%', '60%'));


let server = new IotServer(iotControllers);
server.init()
