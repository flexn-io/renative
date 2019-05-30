package {{APPLICATION_ID}}

import android.content.Intent
import com.facebook.react.ReactActivity
{{PLUGIN_ACTIVITY_IMPORTS}}

/**
 * Created by ReNative (https://renative.org)
 */

class MainActivity : ReactActivity() {
    override fun getMainComponentName(): String? = "App"

    {{PLUGIN_ACTIVITY_METHODS}}
}
