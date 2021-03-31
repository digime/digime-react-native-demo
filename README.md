![logo]
<p align="center">
    <a href="https://developers.digi.me/slack/join">
        <img src="https://img.shields.io/badge/chat-slack-blueviolet.svg" alt="Developer Chat">
    </a>
    <a href="LICENSE">
        <img src="https://img.shields.io/github/license/digime/digime-react-native-demo" alt="MIT License">
    </a>
    <a href="https://developers.digi.me">
        <img src="https://img.shields.io/badge/web-digi.me-red.svg" alt="Web">
    </a>
    <a href="https://digime.freshdesk.com/support/home">
        <img src="https://img.shields.io/badge/support-freshdesk-721744.svg" alt="Support">
    </a>
</p>

# digi.me React-Native Demo

## Introduction
This is a **proof of concept demonstrator** for React-Native used with [Android][sdk-android] and [iOS][sdk-ios] digi.me SDKs to make content and data requests. For details on the digi.me API and the Private Sharing architecture please visit our [developer docs][developer].

The React-Native demo requires the [digi.me app][digime-app] installed on the target platform to enable user authentication of Private Sharing requests.

This demo app has been created using the [React Native CLI][react-native-cli] command `npx react-native init` to create a new React Native project, and then the digi.me SDKs added to the native projects.

### Requirements ###
**Important** Please ensure that the development environment is setup according to the React Native [Setting up the development environment guide][react-native-dev-env] for React Native CLI Quickstart.

Please also see [Android][sdk-android] and [iOS][sdk-ios] repositories for specific platform digi.me SDK requirements.

## Configuring SDKs
### The Contract ID and App ID
Before accessing the public APIs, a valid Contract ID and App ID are required. The Contract ID uniquely identifies a contract with the user that defines what type of data you want and how much you will get etc.

This demo app references a demo contract from the [sample contracts][developer-contracts] page.

### The .p12 File
All content retrieved is encrypted in transit using the public key bound to its Private Sharing contract. For the SDK to be able to decrypt content transparently, a matching private key must be provided. The .p12 file is an archive format used to bundle the private key with its certificate. The digi.me SDKs accepts PKCS12 encoded files as the default key storage format.

To register a custom Private Sharing contract, please check out [custom sharing contracts][developer-custom-contracts] page.


## Getting Started
### 1. Obtaining your Contract ID, Application ID & Private Key:
To access the digi.me platform, you need to obtain an AppID for your application. You can get yours by registering for one [here][developer-register].

In a production environment, you will also be required to obtain your own Contract ID and Private Key from digi.me support. However, for sandbox purposes, we provide the following example values:

**Example Contract ID:** `fJI8P5Z4cIhP3HawlXVvxWBrbyj5QkTF`

**Example Private Key:**
	<br>&nbsp;&nbsp;&nbsp;&nbsp;Download: [p12 Key Store][file-p12]
	<br>&nbsp;&nbsp;&nbsp;&nbsp;Password: `monkey periscope`

The p12 file has already been included in the assets folder for both Android and iOS projects

### 2. Configuring the demo app
#### a. Updating the credentials in JavaScript
The NativeBridge is used to communicate between JavaScript and Native iOS/Android code.
The `initSDK` function accepts the contractID, appId, p12 filename, and p12 password.

In [App.js][file-app.js], update to add your AppID:

```js
nativeBridge.initSDK(
                  "fJI8P5Z4cIhP3HawlXVvxWBrbyj5QkTF",
                  "YOUR_APP_ID",
                  "fJI8P5Z4cIhP3HawlXVvxWBrbyj5QkTF",
                  "monkey periscope"
                );
```

where `YOUR_APP_ID` should be replaced with your `AppID`.

#### b. iOS: Updating the URL Scheme
Update the custom URL scheme so that the app can receive the callback from the digi.me app.

In [Info.plist][file-info.plist], update to add your AppID:

```xml
<key>CFBundleURLSchemes</key>
<array>
<string>digime-ca-YOUR_APP_ID</string>
</array>
</dict>
```
where `YOUR_APP_ID` should be replaced with your `AppID`.


### Using a different contract ID
To use a different contract ID, the assets and references must be updated,
1. Add your .p12 file to 'android/app/src/main/assets'
1. Import the .p12 file to the ios project using xCode and set the target membership to 'digimedemo'
1. Update the contract ID, .p12 file, and .p12 password referenced in the App.js NativeBridge.initSDK() call


## Installation and First Run
### 1. Install dependencies
```
npm install
```

### 2. Configure demo properties
Add the AppID to App.js. See [Configuring demo app](#2-configuring-the-demo-app) for more information.


### 3. Run the app
for Android:
```
npm run android
```

for iOS
```
npm run ios
```

Copyright © 2021 digi.me Ltd. All rights reserved.

[logo]: https://securedownloads.digi.me/partners/digime/SDKReadmeBanner.png
[developer]: https://developer.digi.me
[developer-register]: https://go.digi.me/developers/register
[developer-contracts]: https://developers.digi.me/sample-sharing-contracts
[developer-custom-contracts]: https://developers.digi.me/get-custom-sharing-contracts
[react-native-dev-env]: https://reactnative.dev/docs/environment-setup "Development environment setup"
[react-native-cli]: https://github.com/react-native-community/cli#creating-a-new-react-native-project "React Native CLI"
[digime-app]: https://digi.me/get-started/ "Get started with digi.me"
[sdk-android]: https://github.com/digime/digime-sdk-android/ "digi.me Android SDK"
[sdk-ios]: https://github.com/digime/digime-sdk-ios/ "digi.me iOS SDK"
[file-p12]: ./ios/digimedemo/fJI8P5Z4cIhP3HawlXVvxWBrbyj5QkTF.p12?raw=true
[file-info.plist]: ./ios/digimedemo/Info.plist#L30-L33
[file-app.js]: ./App.js#L106-L110
