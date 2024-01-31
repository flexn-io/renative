package renative.harness.debug

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback


class CalendarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
override fun getName() = "CalendarModule"

@ReactMethod
fun createCalendarEvent(name: String, location: String, callback:Callback) {
    var result = "Event called with name: $name and location: $location"
    callback.invoke(null, result)
}

}