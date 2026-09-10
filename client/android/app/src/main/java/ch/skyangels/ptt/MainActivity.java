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

        // Remap scan code 115 (Volume Up on PTT devices) or KEYCODE_PTT / KEYCODE_HEADSETHOOK to Space
        if (event.getScanCode() == 115 || event.getKeyCode() == 269 || event.getKeyCode() == 284) {
            isPTT = true;
            eventToProcess = new KeyEvent(
                    event.getDownTime(),
                    event.getEventTime(),
                    event.getAction(),
                    KeyEvent.KEYCODE_SPACE,
                    event.getRepeatCount(),
                    event.getMetaState(),
                    event.getDeviceId(),
                    57, // Remap scan code to 57 (Space)
                    event.getFlags(),
                    event.getSource()
            );
        }

        // Dispatch androidKeyEvent for both DOWN (0) and UP (1)
        int action = eventToProcess.getAction();
        if ((action == KeyEvent.ACTION_DOWN && eventToProcess.getRepeatCount() == 0) || action == KeyEvent.ACTION_UP) {
            String info = "action=" + action + ", keyCode=" + eventToProcess.getKeyCode() + ", scanCode=" + eventToProcess.getScanCode();
            Log.d("REMOTE", "PTT Event: " + info);

            if (bridge != null && bridge.getWebView() != null) {
                String js = String.format(
                        "window.dispatchEvent(new CustomEvent('androidKeyEvent', { detail: { action: %d, keyCode: %d, scanCode: %d } }));",
                        action, eventToProcess.getKeyCode(), eventToProcess.getScanCode()
                );
                bridge.getWebView().evaluateJavascript(js, null);
            }
        }

        // For PTT, forward KeyEvent to WebView and suppress system volume changes
        if (isPTT) {
            if (bridge != null && bridge.getWebView() != null) {
                bridge.getWebView().dispatchKeyEvent(eventToProcess);
            }
            return true;
        }

        return super.dispatchKeyEvent(eventToProcess);
    }
}
