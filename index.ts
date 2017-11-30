import { AppRegistry, EventEmitter, NativeEventEmitter, NativeModules } from 'react-native';

import Events from './src/events/Events';
import { Router } from './src/routing/Router';

const { NativeBridge } = NativeModules;
const emitter: EventEmitter = new NativeEventEmitter(NativeBridge);

const logEvent = (event: string): void => {
    console.log(`event: ${event}`);
}

const init = (): void => {
    /**
     * bridge event listeners
     */
    emitter.addListener(Events.FILE_DATA, (data: any) => logEvent(Events.FILE_DATA));
    emitter.addListener(Events.USER_AUTH_ACCEPT, () => logEvent(Events.USER_AUTH_ACCEPT));
    emitter.addListener(Events.USER_AUTH_REJECT, () => logEvent(Events.USER_AUTH_ACCEPT));

    AppRegistry.registerComponent('CAExample', () => Router);
};

init();