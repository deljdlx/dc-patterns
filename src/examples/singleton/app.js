
// Immediately Invoked Function Expression(IIFE), hides the class from the global scope, but exposes the getInstance method
const WifiRouter = (() => {
    // store the instance of the class
    let instance = null;

    // The class can not be instantiated from outside the IIFE
    class WifiRouter {
        ips = [];
        network = '';
        password = '';
        devices = [];
        constructor(network, password) {
            this.network = network;
            this.password = password;
        }

        // some methods to interact with the class...
        addDevice(device) {
            this.devices.push({
                device: device,
                ip: this.generateIp()
            });
        }

        getDevices() {
            return this.devices;
        }

        reset() {
            this.ips = [];
            this.devices = [];
        }

        generateIp() {
            let ip = '192.168.1.';
            ip += Math.floor(Math.random() * 255) + '.';
            ip = ip.slice(0, -1);
            if (this.ips.includes(ip)) {
                return this.generateIp();
            }
            this.ips.push(ip);
            return ip;
        }
    }

    return {
        // Get the Singleton instance
        getInstance: () => {
            if (!instance) {
                instance = new WifiRouter();
            }
            return instance;
        }
    }
})();

// ===========================

class Device {
    name = '';

    constructor(name) {
        this.name = name;
    }

    connect() {
        // this implementation is not realistic, but it's just for the sake of the example
        // get the Singleton instance and add the device to the network
        WifiRouter.getInstance().addDevice(this);
    }

    render(container) {
        this.element = document.createElement('div');
        this.element.classList.add('device');
        this.element.textContent = this.name;
        container.appendChild(this.element);
    }
}

// ===========================
// UX, not part of the pattern
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const deviceContainer = document.getElementById('devices');
    const routerContainer = document.getElementById('routerDevices');

    const devices = [
        'Mobile Phone',
        'Tablet',
        'Laptop',
        'Printer',
        'Smart TV',
        'Smart Watch',
        'Smart Fridge',
        'Smart Light',
        'Smart Plug',
        'Smart Camera',
    ];

    const trigger = document.getElementById('addDeviceTrigger');
    trigger.addEventListener('click', () => {
        const device = new Device(devices[Math.floor(Math.random() * devices.length)]);
        device.connect();
        device.render(deviceContainer);

        routerContainer.innerHTML = '';

        // Call the Singleton to get the devices
        WifiRouter.getInstance().getDevices().forEach(deviceDescriptor => {
            const tr = document.createElement('tr');
            const td1 = document.createElement('td');
            const td2 = document.createElement('td');
            td1.textContent = deviceDescriptor.device.name;
            td2.textContent = deviceDescriptor.ip;
            tr.appendChild(td1);
            tr.appendChild(td2);
            routerContainer.appendChild(tr);
        });
    });

    const resetTrigger = document.getElementById('resetTrigger');
    resetTrigger.addEventListener('click', () => {
        WifiRouter.getInstance().reset();
        deviceContainer.innerHTML = '';
        routerContainer.innerHTML = '';
    });
});