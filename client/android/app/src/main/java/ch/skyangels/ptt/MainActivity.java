package ch.skyangels.ptt;

import android.util.Log;
import android.view.KeyEvent;
import android.widget.Toast;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        KeyEvent eventToProcess = event;
        boolean isPTT = false;

        // Remap scan code 115 (often Volume Up on PTT devices) to Space
        if (event.getScanCode() == 115) {
            isPTT = true;
            eventToProcess = new KeyEvent(
                    event.getDownTime(),
                    event.getEventTime(),
                    event.getAction(),
                    KeyEvent.KEYCODE_SPACE,
                    event.getRepeatCount(),
                    event.getMetaState(),
                    event.getDeviceId(),
                    57, // Remap scan code to 57 (Space) to ensure 'code' is "Space" in JS
                    event.getFlags(),
                    event.getSource()
            );
        }

        // Only trigger our custom logic on the initial KEY_DOWN (ignore repeat events)
        if (eventToProcess.getAction() == KeyEvent.ACTION_DOWN && eventToProcess.getRepeatCount() == 0) {
            String info = "action=" + eventToProcess.getAction() + ", keyCode=" + eventToProcess.getKeyCode() + ", scanCode=" + eventToProcess.getScanCode();
            Log.d("REMOTE", "PTT Event: " + info);
            
            Toast.makeText(this, "Key Event: " + info, Toast.LENGTH_SHORT).show();

            if (bridge != null && bridge.getWebView() != null) {
                String js = String.format(
                        "window.dispatchEvent(new CustomEvent('androidKeyEvent', { detail: { action: %d, keyCode: %d, scanCode: %d } }));",
                        eventToProcess.getAction(), eventToProcess.getKeyCode(), eventToProcess.getScanCode()
                );
                bridge.getWebView().evaluateJavascript(js, null);
            }
        }

        // For PTT, we must pass both DOWN and UP to the WebView for standard JS events,
        // but we return true to prevent system volume changes.
        if (isPTT) {
            if (bridge != null && bridge.getWebView() != null) {
                bridge.getWebView().dispatchKeyEvent(eventToProcess);
            }
            return true;
        }

        return super.dispatchKeyEvent(eventToProcess);
    }
}