![logo]
# digi.me React-Native Demo
This is a **proof of concept demonstrator** to show React-Native being used to create native apps using the native [Android][sdk-android]  and [iOS][sdk-ios] digi.me SDKs to make content and data requests. For more details on the digi.me API and the Consent Access architecture please visit the [developer support docs][ca-flow].

## Preamble
The React-Native demo depends on the [digi.me app][download] installed on the target platform to enable user authentication of Consent Access requests.

## Prerequisites
- [Yarn][download-yarn] - Package and dependency manager for node
- [ImageMagick][download-image-magick] - used to resize image assets for native images

### For iOS development ###
- [CocoaPods][download-cocoapods] - Package management for iOS development. Used to get the iOS digi.me SDK

### For Android development ###
- [Java Development Kit (Java SE Development Kit JDK)][download-jdk]
- [Android Studio][download-android-studio]. Please ensure that the `ANDROID_HOME` environment variable is set.

## Configuring SDKs
### The Contract ID and App ID
Before accessing the public APIs, a valid _Contract ID_ and _App ID_ are required. The Contract ID uniquely identifies a contract with the user that defines what type of data you want, how much you will get (from a defined time range), what you will and won't do with it, how long you will retain it for and if you will implement the right to be forgotten. It also specifies how the data is encrypted in transit. By default, this react-native-demo is bundled with a demo SDK tester contract and .p12 file. 

### The .p12 File
All content retrieved by the SDK is encrypted in transit using the public key bound to the certificate that was created when the Consent Access contract was created. For the SDK to be able to decrypt content transparently a matching private key must be provided (ie. from the keypair created for contract). The .p12 file is an archive format that's used to bundle the private key with its certificate. Digi.me SDK accepts PKCS #12 encoded files as the default key storage format.

To register a Consent Access contract check out [digi.me developer support][support]. There you can request a Contract ID and App ID to which it is bound.

## Installation and First Run
1. Install dependencies
Installs required dependencies used for the project. **This command only needs to be run once.**
```
yarn install
```

2. Configure demo properties
Add the application id, and .p12 password (supplied by digi.me Ltd) to the [Constants.ts file][file-constants]. See [Configuring The React-Native demo](#configuring-the-react-native-demo) for more information.

3. Compile code
Compiles Typescript to JavaScript and copy assets to the ./dist/ folder. **This command needs to be run each time any TypeScript source code changes**.
```
yarn compile
```

3. Configure native sub projects
Generate native images, copies assets to native projects, and updates native code. **This command only needs to be run if there are any changes to [./src/constants/Constants.ts][file-constants] file or [./assets/][dir-assets].**
```
yarn configure-native
```

4. Start Android
Ensure that an Android device is connected or an Android virtual device is running
```
yarn run-android
```

5. Start iOS
```
yarn run-ios
```

## Configuring The React-Native demo
### Using supplied App Id and .p12 passphrase
Upon obtaining the App ID and .p12 passphrase issued by digi.me Ltd;
1. Update the references used in the [./src/constants/Constants.ts][file-constants] file;

```
    ...
    public static readonly APPLICATION_NAME: string = "[YOUR APPLICATION_NAME]";
    public static readonly APPLICATION_ID: string = "[YOUR APPLICATION_ID]";
    public static readonly P12_PASSPHRASE: string = "[YOUR P12_PASSWORD]";
    ...
```
NOTE:
`CONTRACT_ID` and `P12_FILENAME` are already set to use a predefined demo contract. Please [contact us][contact-us] if you would like to use a different contract.
`[YOUR APPLICATION_NAME]` is used to create the display name used for the compiled apps.
`[YOUR APPLICATION_ID]` is the App ID issued to you by digi.me ltd.
`[YOUR CONTRACT_ID]` is the Contract ID issued to you by digi.me ltd (where specified).
`[YOUR P12_PASSWORD]` is the password that's used for the p12 file and its corresponding contract ID. 

2. Run `yarn compile`
3. Run `yarn configure-native`

### Using a different contract ID
If a different contract ID is required (and supplied by digi.me Ltd), then the code references and assets must also be updated to point and use the new resources. 
1. Add the .p12 file to the top level [./assets/keys][file-constants] sub directory.
2. Update the contract ID, .p12 file, and .p12 password used in the [./src/constants/Constants.ts][file-constants] file.
3. Run `yarn compile`
4. Run `yarn configure-native`
5. For iOS development, please also ensure the .p12 file is imported into the xCode project.

This script copies the p12 assets from the [keys directory][dir-keys] to their native Android and iOS directories, it also updates the native code to add the application and contract references (e.g, updates the [Android strings.xml](file-android-strings) using the [Android SDK][sdk-android] expected string name and provided values).

## Typescript and SDK interaction
Both the native Android and iOS subprojects have been configured to use their respective SDKs. In this PoC, both native projects contain a class `NativeBridge` [(Android) NativeBridge.java][file-android-nativebridge] [(iOS) NativeBridge.m][file-ios-nativebridge]. The NativeBridge currently exposes only one function, `initSDK()` which is called from the JavaScript code to start the native authorisation process.

The native code dispatches [events][file-events] to communicate data back to the JavaScript code. Currently events are dispatched on receiving file data via CA, and accept or rejection of the Consent Access contract from the digi.me app.

### Compiling and running
If changes have been made to the typescript, then both the JavaScript and the React-Native platform specific bundles must be created
Run `yarn compile-run-android` or `yarn compile-run-ios` to compile JavaScript and run the app on Android or iOS.

If (only) changes to the native Android or iOS code have been made, then the JavaScript and native bundles don't need to be recompiled or created.
Run `yarn run-android` or `yarn run-ios` to run the app. Alternatively, open the and run the native code in [(Android) Android Studio][download-android-studio] or [(iOS) XCode][download-xcode].

Copyright © 2018 digi.me Ltd. All rights reserved.

[logo]: https://developers.digi.me/img/digime_logo.png
[react-native]: https://facebook.github.io/react-native/ "React Native"
[support]: https://developers.digi.me/ "developer support"
[contact-us]: https://developers.digi.me/contact "Contact Us"
[download]: https://digi.me/get-started/ "Get started with digi.me"
[ca-flow]: https://developers.digi.me/consent-access-flow.html/
[sdk-android]: https://github.com/digime/digime-android-sdk/ "digi.me iOS SDK"
[sdk-ios]: https://github.com/digime/digime-sdk-ios/ "digi.me Android SDK"
[dir-keys]: ./assets/keys
[dir-assets]: ./assets
[file-constants]: ./src/constants/Constants.ts
[file-events]: ./src/events/Events.ts
[file-android-strings]: ./android/app/src/main/res/values/strings.xml
[file-android-nativebridge]: ./android/app/src/main/java/com/caexample/NativeBridge.java
[file-ios-nativebridge]: ./ios/CAExample/NativeBridge.m

[download-android-studio]: https://developer.android.com/studio/index.html
[download-jdk]: http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html
[download-yarn]: https://yarnpkg.com/en/docs/install
[download-cocoapods]: https://cocoapods.org
[download-image-magick]: https://www.imagemagick.org/script/index.php/
[download-android-studio]: https://developer.android.com/studio/index.html "Download Android Studio"
[download-xcode]: https://developer.apple.com/support/xcode/ "xCode"