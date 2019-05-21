package {{APPLICATION_ID}}

import android.content.Intent
import com.facebook.react.ReactActivity
{{PLUGIN_ACTIVITY_IMPORTS}}

/**
 * Created by paveljacko on 24/07/2018.
 */

class MainActivity : ReactActivity() {
    override fun getMainComponentName(): String? = "App"

    {{PLUGIN_ACTIVITY_METHODS}}
}
