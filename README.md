![logo]
# digi.me React-Native Demo
This is a **proof of concept demonstrator** to show React-Native being used to create native apps using the native [Android][sdk-android]  and [iOS][sdk-ios] digi.me SDKs to make content and data requests. For more details on the digi.me API and the Consent Access architecture please visit the [developer support docs][ca-flow]. 

## Preamble
The React-Native demo depends on the [digi.me app][download] installed on the target platform to enable user authentication of Consent Access requests. 

## Prerequisites
- [ImageMagick][download-image-magick] - used to resize image assets for native images

## Installation and First Run
Install the dependencies used for the project
```
yarn install
```

```
yarn compile-javascript
```

Generate native images, copy assets, and update native code
```
yarn configure-native
```

Start Android
```
yarn run-android
```

Start iOS
```
yarn run-ios
```

## Configuring SDKs
### Obtaining your Contract ID and App ID
Before accessing the public APIs, a valid _Contract ID_ and _App ID_ are required. The Contract ID uniquely identifies a contract with the user that defines out what type of data you want, what you will and won't do with it, how long you will retain it and if you will implement the right to be forgotten. It also specifies how the data is encrypted in transit.

All content retrieved by the SDK is encrypted in transit using the public key bound to the certificate that was created when the Consent Access contract was created. For the SDK to be able to decrypt content transparently matching private key must be provided (ie. from the keypair created for contract). Digi.me SDK accepts PKCS #12 encoded files as the default key storage format. API exposes multiple input vectors for p12 files.

To register a Consent Access contract check out [digi.me developer support][support]. There you can request a Contract ID and App ID to which it is bound.

### Configuring React-Native
Upon obtaining the Contract ID, App ID, .p12 file (and its passphrase). 
1. Add the .p12 file to the top level [assets/keys][dir-keys] sub directory.
2. Update the references used in the [Constants.ts][file-constants] file;

```
    public static readonly APPLICATION_ID: string = "<your appId>";
    public static readonly CONTRACT_ID: string = "<your contractId>";
    public static readonly P12_PASSPHRASE: string = "<your p12 passphrase>";
    public static readonly P12_FILENAME: string = "<your p12 filename>";
```

3. Run `yarn set-native-resources`
This script copies the p12 assets from the [keys directory][dir-keys] to their native Android and iOS directories, it also updates the native code to add the application and contract references (e.g, updates the [Android strings.xml](file-android-strings) using the [Android SDK][sdk-android] expected string name and provided values).

## Typescript and SDK interaction
Both the native Android and iOS subprojects have been configured to use their respective SDKs. In this PoC, both native projects contain a class `NativeBridge` [(Android) NativeBridge.java][file-android-nativebridge] [(iOS) NativeBridge.m][file-ios-nativebridge]. The NativeBridge currently exposes only one function, `initSDK()` which is called from the JavaScript code to start the native authorisation process. 

The native code dispatches [events][file-events] to communicate data back to the JavaScript code. Currently events are dispatched on receiving file data via CA, and accept or rejection of the Consent Access contract from the digi.me app. 

### Compiling and running
If changes have been made to the typescript, then both the JavaScript and the React-Native platform specific bundles must be created
Run `yarn compile-run-android` or `yarn compile-run-ios` to compile JavaScript and run the app on Android or iOS. 

If (only) changes to the native Android or iOS code have been made, then the JavaScript and native bundles don't need to be recompiled or created. 
Run `yarn run-android` or `yarn run-ios` to run the app. Alternatively, open the and run the native code in [(Android) Android Studio][download-android-studio] or [(iOS) XCode][download-xcode].


##
Copyright © 2018 digi.me Ltd. All rights reserved.


[logo]: https://developers.digi.me/img/digime_logo.png
[react-native]: https://facebook.github.io/react-native/ "React Native"
[support]: https://developers.digi.me/ "developer support"
[download]: https://digi.me/get-started/ "Get started with digi.me"
[ca-flow]: https://developers.digi.me/consent-access-flow.html/
[sdk-android]: https://github.com/digime/digime-android-sdk/ "digi.me iOS SDK"
[sdk-ios]: https://github.com/digime/digime-sdk-ios/ "digi.me Android SDK"
[dir-keys]: ./assets/keys
[file-constants]: ./src/constants/Constants.ts
[file-events]: ./src/events/Events.ts
[file-android-strings]: ./android/app/src/main/res/values/strings.xml
[file-android-nativebridge]: ./android/app/src/main/java/com/caexample/NativeBridge.java
[file-ios-nativebridge]: ./ios/CAExample/NativeBridge.m

[download-image-magick]: https://www.imagemagick.org/script/index.php/
[download-android-studio]: https://developer.android.com/studio/index.html "Download Android Studio"
[download-xcode]: https://developer.apple.com/support/xcode/ "xCode"
