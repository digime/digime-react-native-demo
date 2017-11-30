//
//  Extensions.swift
//  Sand
//
//  Created on 19/07/2017.
//  Copyright © 2017 digime. All rights reserved.
//

import Foundation
import UIKit

extension Data {
    
    func hexEncodedString() -> String {
        return map { String(format: "%02hhx", $0) }.joined()
    }
}

extension String {
    
    static func getDigiMeSDKStateString(_ state: DigiMeFrameworkOperationState) -> String {
        
        switch state {
            
        case .StateUndefined:
            return "Undefined"
        case .StateFrameworkInit:
            return "Initializing and Validating"
        case .StateRequestingSessionKey:
            return "Requesting Session Key"
        case .StateSessionKeyReceived:
            return "Session Key Received"
        case .StatePermissionAccessRequestSent:
            return "Request is Sent to digi.me app"
        case .StatePermissionAccessRequestGranted:
            return "Consent Access Request Granted"
        case .StatePermissionAccessRequestCancelled:
            return "Consent Access Request Cancelled"
        case .StateDataRequestSent:
            return "Data Request is Sent"
        case .StateDataRequestReceived:
            return "Data Received"
        case .StateDataReceivedAllDone:
            return "All Done"
        }
    }
}
