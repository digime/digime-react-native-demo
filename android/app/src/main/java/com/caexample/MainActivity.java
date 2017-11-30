package com.caexample;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.ReactActivity;

import me.digi.sdk.core.DigiMeAuthorizationManager;
import me.digi.sdk.core.DigiMeClient;

public class MainActivity extends ReactActivity {
    private static final String TAG = "MainActivity";

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "CAExample";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Log.d(TAG, "onActivityResult: ");
        DigiMeClient.getInstance().getAuthManager().onActivityResult(requestCode, resultCode, data);
    }
}
