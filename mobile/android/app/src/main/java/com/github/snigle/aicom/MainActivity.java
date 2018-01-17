package com.github.snigle.aicom;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.soloader.SoLoader;
import com.google.firebase.FirebaseApp;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Slifer";
    }

    @Override
    public void onResume() {
        super.onResume();
        Intent service = new Intent(getApplicationContext(), MainService.class);
        Bundle bundle = new Bundle();
        service.putExtras(bundle);

        getApplicationContext().startService(service);
    }

}
