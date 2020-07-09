package com.digimedemo;

import android.content.Intent;

import com.facebook.react.ReactActivity;

import me.digi.sdk.interapp.DMEAppCommunicator;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "digimedemo";
  }

  // add the override for OnActivityResult
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    DMEAppCommunicator.getSharedInstance().onActivityResult(requestCode, resultCode, data);
  }
}
