package {{APPLICATION_ID}};

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
{{PLUGIN_SPLASH_ACTIVITY_IMPORTS}}

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent fcmIntent = getIntent();
        // Bundle bundle = fcmIntent.getExtras();

        // Start the main activity
        Intent intent = new Intent(this, MainActivity.class);
        intent.putExtras(fcmIntent);
        startActivity(intent);

        if (!isTaskRoot()) {
            finish();
        }
    }
}