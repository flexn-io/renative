package {{configProps.id}}


import android.content.Context
import com.google.android.gms.cast.framework.CastOptions


import com.reactnative.googlecast.GoogleCastOptionsProvider

class CastOptionsProvider : GoogleCastOptionsProvider() {
    override fun getCastOptions(context: Context): CastOptions {
        return CastOptions.Builder()
                .setReceiverApplicationId("{{props.applicationID}}")
                .build()
    }
}