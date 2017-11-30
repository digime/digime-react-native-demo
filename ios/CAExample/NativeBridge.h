#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "DMEClient.h"

@interface NativeBridge : RCTEventEmitter <RCTBridgeModule, DMEClientDelegate>

- (void)emitEventWithName:(NSString *)name andPayload:(NSDictionary *) payload;
- (void)initSDK;
- (void)sessionCreated:(CASession *)session;
- (void)sessionCreateFailed:(NSError *)error;
- (void)authorizeSucceeded:(CASession *)session;
- (void)authorizeDenied:(NSError *)error;
- (void)authorizeFailed:(NSError *)error;
- (void)clientRetrievedFileList:(CAFiles *)files;
- (void)clientFailedToRetrieveFileList:(NSError *)error;
- (void)fileRetrieved:(CAFile *)file;
- (void)fileRetrieveFailed:(NSString *)fileId error:(NSError *)error;

@end
