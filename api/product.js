export default function handler(req, res) {
  const { query } = req;
  const productHandle = req.url.split('/products/')[1];

  const shopifyDomain = 'celestialjewel.co.in';
  const flutterAppScheme = 'celestialjewel://';
  const appStoreUrl = 'https://apps.apple.com/in/app/celestial-jewels/id6751133452';
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=your.package.name';

  const userAgent = req.headers['user-agent'] || '';
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  const appDeepLink = `${flutterAppScheme}product/${productHandle}`;
  const webUrl = `https://${shopifyDomain}/products/${productHandle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <p>Redirecting to Celestial Jewel...</p>
    
    <script type="text/javascript">
        (function() {
            const isIOS = ${isIOS};
            const isAndroid = ${isAndroid};
            const appDeepLink = '${appDeepLink}';
            const webUrl = '${webUrl}';

            let appOpened = false;
            let visibilityChanged = false;

            // Detect if app was opened
            function onVisibilityChange() {
                if (document.hidden || document.webkitHidden) {
                    visibilityChanged = true;
                    appOpened = true;
                }
            }

            function onBlur() {
                appOpened = true;
            }

            document.addEventListener('visibilitychange', onVisibilityChange);
            document.addEventListener('webkitvisibilitychange', onVisibilityChange);
            window.addEventListener('blur', onBlur);
            window.addEventListener('pagehide', onBlur);

            function redirect() {
                if (isAndroid) {
                    // Android: Try to open app directly
                    window.location.replace(appDeepLink);
                    
                    // Fallback to website after 2 seconds
                    setTimeout(function() {
                        if (!appOpened && !visibilityChanged) {
                            window.location.replace(webUrl);
                        }
                    }, 2000);
                } else if (isIOS) {
                    // iOS: Use iframe to avoid Safari error
                    const iframe = document.createElement('iframe');
                    iframe.style.border = 'none';
                    iframe.style.width = '1px';
                    iframe.style.height = '1px';
                    iframe.style.position = 'absolute';
                    iframe.style.top = '-9999px';
                    document.body.appendChild(iframe);
                    iframe.src = appDeepLink;

                    // Check after 2 seconds
                    setTimeout(function() {
                        if (!appOpened && !visibilityChanged) {
                            // App not opened, go to website
                            window.location.replace(webUrl);
                        }
                        // Clean up iframe
                        try {
                            document.body.removeChild(iframe);
                        } catch(e) {}
                    }, 2000);
                } else {
                    // Desktop or unknown device - go to website
                    window.location.replace(webUrl);
                }
            }

            // Start redirect immediately when page loads
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', redirect);
            } else {
                redirect();
            }
        })();
    </script>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
