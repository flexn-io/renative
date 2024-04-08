package {{configProps.id}}

import android.content.Context
import com.google.android.gms.cast.framework.CastOptions


import com.reactnative.googlecast.GoogleCastOptionsProvider

class CastOptionsProvider : OptionsProvider {
    override fun getCastOptions(context: Context): CastOptions {
        return Builder()
            .setReceiverApplicationId(context.getString(R.string.app_id))
            .build()
    }

    override fun getAdditionalSessionProviders(context: Context): List<SessionProvider>? {
        return null
    }
}