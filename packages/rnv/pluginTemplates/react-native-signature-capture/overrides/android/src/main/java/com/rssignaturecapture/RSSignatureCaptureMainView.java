package com.rssignaturecapture;

import android.util.Log;
import android.view.ViewGroup;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.io.File;
import java.io.FileOutputStream;
import java.io.ByteArrayOutputStream;

import android.util.Base64;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.LinearLayout;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import java.lang.Boolean;
import java.io.IOException;

public class RSSignatureCaptureMainView extends LinearLayout implements OnClickListener,RSSignatureCaptureView.SignatureCallback {
  LinearLayout buttonsLayout;
  RSSignatureCaptureView signatureView;

  Activity mActivity;
  int mOriginalOrientation;
  Boolean saveFileInExtStorage = false;
  String viewMode = "portrait";
  Boolean showBorder = true;
  Boolean showNativeButtons = true;
  Boolean showTitleLabel = true;
  int maxSize = 500;

  public RSSignatureCaptureMainView(Context context, Activity activity) {
    super(context);
    Log.d("React:", "RSSignatureCaptureMainView(Contructtor)");
    mOriginalOrientation = activity.getRequestedOrientation();
    mActivity = activity;

    this.setOrientation(LinearLayout.VERTICAL);
    this.signatureView = new RSSignatureCaptureView(context,this);
    // add the buttons and signature views
    this.buttonsLayout = this.buttonsLayout();
    this.addView(this.buttonsLayout);
    this.addView(signatureView);

    setLayoutParams(new android.view.ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT));
  }

  public RSSignatureCaptureView getSignatureView() {
    return signatureView;
  }

  public void setSaveFileInExtStorage(Boolean saveFileInExtStorage) {
    this.saveFileInExtStorage = saveFileInExtStorage;
  }

  public void setViewMode(String viewMode) {
    this.viewMode = viewMode;

    if (viewMode.equalsIgnoreCase("portrait")) {
      mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    } else if (viewMode.equalsIgnoreCase("landscape")) {
      mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
    }
  }

  public void setShowNativeButtons(Boolean showNativeButtons) {
    this.showNativeButtons = showNativeButtons;
    if (showNativeButtons) {
      Log.d("Added Native Buttons", "Native Buttons:" + showNativeButtons);
      buttonsLayout.setVisibility(View.VISIBLE);
    } else {
      buttonsLayout.setVisibility(View.GONE);
    }
  }

  public void setMaxSize(int size) {
    this.maxSize = size;
  }


  private LinearLayout buttonsLayout() {

    // create the UI programatically
    LinearLayout linearLayout = new LinearLayout(this.getContext());
    Button saveBtn = new Button(this.getContext());
    Button clearBtn = new Button(this.getContext());

    // set orientation
    linearLayout.setOrientation(LinearLayout.HORIZONTAL);
    linearLayout.setBackgroundColor(Color.WHITE);

    // set texts, tags and OnClickListener
    saveBtn.setText("Save");
    saveBtn.setTag("Save");
    saveBtn.setOnClickListener(this);

    clearBtn.setText("Reset");
    clearBtn.setTag("Reset");
    clearBtn.setOnClickListener(this);

    linearLayout.addView(saveBtn);
    linearLayout.addView(clearBtn);

    // return the whoe layout
    return linearLayout;
  }

  // the on click listener of 'save' and 'clear' buttons
  @Override public void onClick(View v) {
    String tag = v.getTag().toString().trim();

    // save the signature
    if (tag.equalsIgnoreCase("save")) {
      try {
        this.saveImage();
      } catch (IOException e) {
        e.printStackTrace();
      }
    }

    // empty the canvas
    else if (tag.equalsIgnoreCase("Reset")) {
      this.signatureView.clearSignature();
    }
  }

  /**
   * save the signature to an sd card directory
   */
  final void saveImage() throws IOException {
    File outputDir = this.getContext().getCacheDir();
    Long tsLong = System.currentTimeMillis()/1000;
    String ts = tsLong.toString();
    File file = File.createTempFile("signature" + ts, ".png", outputDir);
    
    if (file.exists()) {
      file.delete();
    }

    try {

      Log.d("React Signature", "Save file-======:" + saveFileInExtStorage);
      // save the signature
      FileOutputStream out = new FileOutputStream(file);
      this.signatureView.getSignature().compress(Bitmap.CompressFormat.PNG, 90, out);
      out.flush();
      out.close();

      ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
      Bitmap resizedBitmap = getResizedBitmap(this.signatureView.getSignature());
      resizedBitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);


      byte[] byteArray = byteArrayOutputStream.toByteArray();
      String encoded = Base64.encodeToString(byteArray, Base64.NO_WRAP);

      WritableMap event = Arguments.createMap();
      event.putString("pathName", file.getAbsolutePath());
      event.putString("encoded", encoded);
      ReactContext reactContext = (ReactContext) getContext();
      reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "topChange", event);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public Bitmap getResizedBitmap(Bitmap image) {
    Log.d("React Signature","maxSize:"+maxSize);
    int width = image.getWidth();
    int height = image.getHeight();

    float bitmapRatio = (float) width / (float) height;
    if (bitmapRatio > 1) {
      width = maxSize;
      height = (int) (width / bitmapRatio);
    } else {
      height = maxSize;
      width = (int) (height * bitmapRatio);
    }

    return Bitmap.createScaledBitmap(image, width, height, true);
  }


  public void reset() {
    if (this.signatureView != null) {
      this.signatureView.clearSignature();
    }
  }

  @Override public void onDragged() {
    WritableMap event = Arguments.createMap();
    event.putBoolean("dragged", true);
    ReactContext reactContext = (ReactContext) getContext();
    reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "topChange", event);

  }
}