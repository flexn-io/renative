package {{APPLICATION_ID}}

import android.content.Intent
import com.facebook.react.ReactActivity
{{PLUGIN_ACTIVITY_IMPORTS}}

class MainActivity : ReactActivity() {
    override fun getMainComponentName(): String? = "App"
}
