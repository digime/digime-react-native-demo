//
//  NativeBridge.m
//  digimedemo
//
//  Created by testuser on 17/06/2020.
//

// #import <Foundation/Foundation.h>

#import <DigiMeSDK/NSData+DMECrypto.h>
#import <DigiMeSDK/NSString+DMECrypto.h>

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@import DigiMeSDK;

// https://reactnative.dev/docs/native-modules-ios#register-the-module

@interface NativeBridge : RCTEventEmitter <RCTBridgeModule>
@property (nonatomic, strong) DMEPullClient *dmeClient;
@end

@implementation NativeBridge

// To export the module (NativeBridge)
RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[
     @"fileData",
     @"completed",
     @"error",
  ];
}

RCT_REMAP_METHOD(initSDK,
                 contractID:(NSString *) contractID
                 applicationID:(NSString *) appID
                 p12Name:(NSString *) p12name
                 p12Pass:(NSString *) p12pass) {
  
  NSString *privateKeyHex = [DMECryptoUtilities privateKeyHexFromP12File: p12name password: p12pass];
  DMEPullConfiguration *configuration = [[DMEPullConfiguration alloc] initWithAppId: appID contractId: contractID privateKeyHex: privateKeyHex];

  [configuration setDebugLogEnabled:(YES)];

  self.dmeClient = [[DMEPullClient alloc] initWithConfiguration:configuration];

  [self.dmeClient authorizeWithCompletion:^(DMESession * _Nullable session, NSError * _Nullable error) {
    if (session != nil)
    {
      [self.dmeClient getSessionDataWithDownloadHandler:^(DMEFile * _Nullable file, NSError * _Nullable error) {
        [self sendEventWithName:@"fileData" body:file.fileContentAsString];
        // Handle each downloaded file here.
      } completion:^(DMEFileList * _Nullable fileList, NSError * _Nullable error) {
        [self sendEventWithName:@"completed" body:nil];
      }];
    }

    if (error != nil) {
      [self sendEventWithName:@"error" body:nil];
    }
  }];
}

@end
