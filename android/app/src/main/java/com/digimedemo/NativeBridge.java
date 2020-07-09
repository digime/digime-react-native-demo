package com.digimedemo;

import android.app.Activity;
import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

import me.digi.sdk.DMEPullClient;
import me.digi.sdk.entities.DMEPullConfiguration;
import me.digi.sdk.utilities.crypto.DMECryptoUtilities;

/**
 * Created by Oli on 17/07/2020.
 */

public class NativeBridge extends ReactContextBaseJavaModule {
    private static final String TAG = "NativeBridge";

    public NativeBridge(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private void sendEvent(String eventName) {
        sendEvent(eventName, null);
    }

    private void sendEvent(String eventName, @Nullable String data) {
        super.getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, data);
    }

    @Override
    public String getName() {
        return "NativeBridge";
    }

    @ReactMethod
    public void initSDK(String contractID, String appID, String p12name, String p12pass) {
        Log.d(TAG, "initSDK");

        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            Log.d(TAG, "initSDK: Can't Authorize - Current Activity not set");
            return;
        }

        Context applicationContext = super.getReactApplicationContext().getApplicationContext();

        String pk = new DMECryptoUtilities(applicationContext).privateKeyHexFrom(p12name+".p12", p12pass);

        DMEPullConfiguration cfg = new DMEPullConfiguration(appID, contractID, pk);

        DMEPullClient client = new DMEPullClient(applicationContext, cfg);
        client.authorize(currentActivity, (session, error) -> {

            if (session != null) {
                client.getSessionData((file, fileError) -> {
                    // per each file
                    sendEvent("fileData", new String(file.fileContent));
                    return null;
                }, (fileList, listError) -> {
                    // completed
                    sendEvent("completed");
                    return null;
                });
            }
            if (error != null) {
                Log.e(TAG, error.getMessage());
                sendEvent("error");
            }

            return null;
        });
    }
}
