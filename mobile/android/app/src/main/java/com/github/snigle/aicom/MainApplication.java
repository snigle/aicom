package com.github.snigle.aicom;

import android.app.Application;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactApplication;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;

import com.google.firebase.FirebaseApp;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNI18nPackage(),
            new FIRMessagingPackage(),
            new RNGoogleSigninPackage(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FirebaseApp.initializeApp(this);
    Intent service = new Intent(getApplicationContext(), MainService.class);
    Bundle bundle = new Bundle();
    service.putExtras(bundle);

    getApplicationContext().startService(service);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
