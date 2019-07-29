// IOSBridge.h

#import "NativeBridge.h"
#import "DMECryptoUtilities.h"
#import "DMEClient.h"
#import "Constants.h"

@interface NativeBridge () <DMEClientAuthorizationDelegate, DMEClientDownloadDelegate>
@end

@implementation NativeBridge

RCT_EXPORT_MODULE(NativeBridge);

+ (id)allocWithZone:(NSZone *)zone {
  static NativeBridge *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[
    @"fileRetrieveFailed",
    @"fileRetrieved",
    @"fileListFailed",
    @"fileListRetrieved",
    @"userAuthAccept",
    @"userAuthDenied",
    @"userAuthFailed",
    @"accountsRetrieved",
    @"accountsRetrieveFailed"
  ];
}

RCT_EXPORT_METHOD(initSDK)
{
  NSLog(@"digime: iOS SDK inited");
  NSLog(@"digime: Using parameters file: %@, password: %@, applicationid: %@, contractid: %@", P12_FILENAME, P12_PASSPHRASE, APPLICATION_ID, CONTRACT_ID);

  NSString *privateKeyHex = [DMECryptoUtilities privateKeyHexFromP12File:P12_FILENAME password:P12_PASSPHRASE];
  
  if (privateKeyHex) {
    DMEClientConfiguration *config = [DMEClientConfiguration new];
    config.maxRetryCount = 10;
    [DMEClient sharedClient].clientConfiguration = config;

    [DMEClient sharedClient].authorizationDelegate = self;
    [DMEClient sharedClient].downloadDelegate = self;
    [DMEClient sharedClient].appId = APPLICATION_ID;
    [DMEClient sharedClient].contractId = CONTRACT_ID;
    [DMEClient sharedClient].privateKeyHex = privateKeyHex;

    return;
  }
  NSLog(@"digime: Unable to create private key. Please check config variables.");
}

RCT_EXPORT_METHOD(getFileList)
{
  NSLog(@"digime: Getting file list");
  [[DMEClient sharedClient] getFileList];
}

RCT_EXPORT_METHOD(getAccounts)
{
  NSLog(@"digime: Getting account list");

  [[DMEClient sharedClient] getAccountsWithCompletion:^(CAAccounts * _Nullable accounts, NSError * _Nullable error) {

    if (!error) {
      NSError * err;
      NSData * jsonData = [NSJSONSerialization  dataWithJSONObject:accounts.json options:0 error:&err];
      NSString * body = [[NSString alloc] initWithData:jsonData   encoding:NSUTF8StringEncoding];

      NSLog(@"digime: Got accounts %@", body);

      [[NativeBridge allocWithZone: nil] emitEventWithName:@"accountsRetrieved" body: body];
    } else {
      NSLog(@"digime: Getting accounts failed %@", error);
      [[NativeBridge allocWithZone: nil] emitEventWithName:@"accountsRetrieveFailed" body: error.localizedDescription];
    }
  }];
}

RCT_EXPORT_METHOD(authorize)
{
  NSLog(@"digime: Authorizing...");
  [[DMEClient sharedClient] authorize];
}

RCT_EXPORT_METHOD(getFile:(NSString *)fileId)
{
  NSLog(@"digime: Getting file %@...", fileId);
  [[DMEClient sharedClient] getFileWithId:fileId];
}

- (void)emitEventWithName:(NSString *)name body:(NSString *) payload {
  NSLog(@"digime: Will emit event");
  [self sendEventWithName:name body:payload];
}

- (void)sessionCreated:(CASession *)session {
  NSLog(@"digime: Session Created!");
}

- (void)sessionCreateFailed:(NSError *)error {
  NSLog(@"digime: Session Create Failed");
}

- (void)authorizeSucceeded:(CASession *)session {
  NSLog(@"digime: Auth Success");
  [[NativeBridge allocWithZone: nil] emitEventWithName:@"userAuthAccept" body:@""];
}

- (void)authorizeDenied:(NSError *)error {
  NSLog(@"digime: Auth Deny");
  [[NativeBridge allocWithZone: nil] emitEventWithName:@"userAuthDenied" body:@""];
}

- (void)authorizeFailed:(NSError *)error {
  NSLog(@"digime: Auth Failed");
  [[NativeBridge allocWithZone: nil] emitEventWithName:@"userAuthFailed" body:@""];
}

- (void)clientRetrievedFileList:(CAFiles *)files {
  NSLog(@"digime: Client retrieved file list");

  NSError * err;
  NSData * jsonData = [NSJSONSerialization  dataWithJSONObject:files.fileIds options:0 error:&err];
  NSString * body = [[NSString alloc] initWithData:jsonData   encoding:NSUTF8StringEncoding];

  [[NativeBridge allocWithZone: nil] emitEventWithName:@"fileListRetrieved" body: body];
}

- (void)clientFailedToRetrieveFileList:(NSError *)error {
  NSLog(@"digime: Client failed to get file list");
  [[NativeBridge allocWithZone: nil] emitEventWithName:@"fileListFailed" body:@""];
}

- (void)fileRetrieved:(CAFile *)file {
  NSLog(@"digime: File retrieved");

  NSDictionary *fileDict = @{@"fileId" : file.fileId,
                         @"json" : file.json};

  NSError *writeError = nil;
  NSData *jsonData = [NSJSONSerialization dataWithJSONObject:fileDict options:kNilOptions error:&writeError];
  NSString *stringData = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];

  NSLog(@"digime: Sending file data Event for %@", file.fileId);
  [[NativeBridge allocWithZone: nil] emitEventWithName:@"fileRetrieved" body: stringData];
}

- (void)fileRetrieveFailed:(NSString *)fileId error:(NSError *)error {
  NSLog(@"digime: Failed retrieving file %@, %@", fileId, error);
  [[NativeBridge allocWithZone: nil] emitEventWithName:@"fileRetrieveFailed" body: fileId];
}

@end
