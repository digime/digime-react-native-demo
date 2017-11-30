import {
    EmitterSubscription,
    EventEmitter,
    EventEmitterListener,
    EventSubscriptionVendor,
    NativeEventEmitter,
    NativeModules
} from "react-native";

/**
 * NativeBridge acts as the 'bridge' between Javascript
 * and the Native platform code.
 */
export class NativeBridge implements EventEmitterListener {
    private static _instance: NativeBridge;
    private eventEmitter: EventEmitter;

    public static getNativeBridge(): NativeBridge {
        if (!NativeBridge._instance) {
            return new NativeBridge();
        }
    }

    constructor() {
        this.eventEmitter = new NativeEventEmitter(this.getBridge());
    }

    private getBridge(): EventSubscriptionVendor {
        return NativeModules.NativeBridge;
    }

    /**
     * Calls exposed function in native Android and iOS code
     */
    public initSDK(): void {
        // check if the function is available
        if ('initSDK' in this.getBridge()) {
            (<any>this.getBridge()).initSDK();
        }
    }

    public addListener(eventType: string, listener: (...args: any[]) => any, context?: any): EmitterSubscription {
        return this.eventEmitter.addListener(eventType, listener, context);
    }
}
