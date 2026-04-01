package com.jaygnz.athavid;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleShareIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleShareIntent(intent);
    }

    private void handleShareIntent(Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null) {
            if (type.startsWith("video/")) {
                // Video file shared directly
                Uri videoUri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
                if (videoUri != null) {
                    // Pass to WebView via URL parameter
                    getBridge().getWebView().post(() ->
                        getBridge().getWebView().evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('sachi-share', { detail: { type: 'video', uri: '" + videoUri.toString() + "' } }))",
                            null
                        )
                    );
                }
            } else if ("text/plain".equals(type)) {
                // URL/link shared (e.g. TikTok share link)
                String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
                if (sharedText != null) {
                    String escaped = sharedText.replace("'", "\\'").replace("\n", " ");
                    getBridge().getWebView().post(() ->
                        getBridge().getWebView().evaluateJavascript(
                            "window.dispatchEvent(new CustomEvent('sachi-share', { detail: { type: 'url', url: '" + escaped + "' } }))",
                            null
                        )
                    );
                }
            }
        }
    }
}
