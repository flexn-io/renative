package {{APPLICATION_ID}}

import android.os.Bundle
import android.content.Intent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate


{{PLUGIN_ACTIVITY_IMPORTS}}


class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "RNVApp"

  override fun onCreate(savedInstanceState: Bundle?) {
      {{INJECT_ON_CREATE}}
      {{PLUGIN_ON_CREATE}} 
  }

   override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        {{PLUGIN_ON_ACTIVITY_RESULT}}
    }

    override fun onNewIntent(intent:Intent) {
      setIntent(intent)
      super.onNewIntent(intent)
    }

    {{PLUGIN_ACTIVITY_METHODS}}

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
