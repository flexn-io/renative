package {{APPLICATION_ID}}

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.support.v7.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val fcmIntent: Intent = this.getIntent()
        val bundle: Bundle = fcmIntent.getExtras()

        // Start main activity
        val intent: Intent = Intent(this, MainActivity::class.java)
        intent.putExtras(fcmIntent)
        startActivity(intent)

        finish()
    }
}
