import {
    NativeEventEmitter,
    NativeModules
} from "react-native";

// define the nativeBridge from the iOS / Andriod projects
// ensure that the module has been registered in the native iOS/Android
const _NativeBridge = NativeModules.NativeBridge;

/**
 * NativeBridge acts as the 'bridge' between Javascript
 * and the Native platform code.
 */
class NativeBridge {
    static _instance;
    _eventEmitter;

    static getNativeBridge() {
        if (!NativeBridge._instance) {
            NativeBridge._instance = new NativeBridge();
        }

        return NativeBridge._instance;
    }

    constructor() {
        this._eventEmitter = new NativeEventEmitter(_NativeBridge);
    }

    /**
     * Calls exposed function in native Android and iOS code
     */
    initSDK(contractID, appID, p12name, p12pass) {
        // check if the function is available
        if ('initSDK' in _NativeBridge) {
            _NativeBridge.initSDK(contractID, appID, p12name, p12pass);
        }
    }

    addListener(eventType, listener, context) {
        return this._eventEmitter.addListener(eventType, listener, context);
    }

    removeListener(eventType, listener) {
        return this._eventEmitter.removeListener(eventType, listener);
    }
}

module.exports = NativeBridge;
