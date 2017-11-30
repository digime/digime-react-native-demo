// IOSBridge.h

#import "NativeBridge.h"
#import "DMECryptoUtilities.h"
#import "DMEClient.h"
#import "Constants.h"

@implementation NativeBridge

RCT_EXPORT_MODULE(NativeBridge);

RCT_EXPORT_METHOD(initSDK)
{
  [DMEClient sharedClient].delegate = self;
  
  NSLog(@"iOS SDK inited");
  NSLog(@"Using parameters file: %@, password: %@, applicationid: %@, contractid: %@", P12_FILENAME, P12_PASSPHRASE, APPLICATION_ID, CONTRACT_ID);
  
  NSString *privateKeyHex = [DMECryptoUtilities privateKeyHexFromP12File:P12_FILENAME password:P12_PASSPHRASE];
  if (privateKeyHex) {
    [DMEClient sharedClient].appId = APPLICATION_ID;
    [DMEClient sharedClient].contractId = CONTRACT_ID;
    [DMEClient sharedClient].privateKeyHex = privateKeyHex;
    [[DMEClient sharedClient] authorize];
    
    return;
  }
  NSLog(@"Unable to create private key. Please check config variables.");
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
           @"fileData",
           @"userAuthAccept",
           @"userAuthReject"
  ];
}

- (void)emitEventWithName:(NSString *)name andPayload:(NSDictionary *) payload {
  NSLog(@"Will emit event");
  [self sendEventWithName:name body:payload];
}

- (void)sessionCreated:(CASession *)session {
  NSLog(@"Session Created!");
}

- (void)sessionCreateFailed:(NSError *)error {
  NSLog(@"Session Create Failed");
}

- (void)authorizeSucceeded:(CASession *)session {
  NSLog(@"Auth Success");
  [self sendEventWithName:@"userAuthAccept" body:@""];
  [[DMEClient sharedClient] getFileList];
}

- (void)authorizeDenied:(NSError *)error {
  NSLog(@"Auth Deny");
  [self sendEventWithName:@"userAuthReject" body:@""];
}

- (void)authorizeFailed:(NSError *)error {
  NSLog(@"Auth Failed");
  [self sendEventWithName:@"userAuthReject" body:@""];
}

- (void)clientRetrievedFileList:(CAFiles *)files {
  NSLog(@"Client retrieved file list");
  
  for (NSString *fileId in files.fileIds) {
    [[DMEClient sharedClient] getFileWithId:fileId];
  }
}

- (void)clientFailedToRetrieveFileList:(NSError *)error {
  NSLog(@"Client failed to get file list");
}

- (void)fileRetrieved:(CAFile *)file {
  NSLog(@"file retived");

  NSError *writeError = nil;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:file.json options:kNilOptions error:&writeError];
  NSString *stringData = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

  [self sendEventWithName:@"fileData" body: stringData];
}

- (void)fileRetrieveFailed:(NSString *)fileId error:(NSError *)error {
  NSLog(@"file retrived failed");
}

@end
