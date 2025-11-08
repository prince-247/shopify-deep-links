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
    <script type="text/javascript">
        const isIOS = ${isIOS};
        const isAndroid = ${isAndroid};
        const appDeepLink = '${appDeepLink}';
        const appStoreUrl = '${appStoreUrl}';
        const playStoreUrl = '${playStoreUrl}';
        const webUrl = '${webUrl}';

        let appOpened = false;
        let startTime = Date.now();

        // Detect if app was opened
        window.addEventListener('blur', function() {
            appOpened = true;
        });

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                appOpened = true;
            }
        });

        function tryOpenApp() {
            if (isAndroid) {
                // Android: Try to open app
                window.location.href = appDeepLink;
                
                // Fallback after 1.5 seconds
                setTimeout(function() {
                    if (!appOpened) {
                        window.location.href = webUrl;
                    }
                }, 1500);
            } else if (isIOS) {
                // iOS: Use iframe trick to avoid Safari error
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = appDeepLink;
                document.body.appendChild(iframe);

                // Check if app opened after 1.5 seconds
                setTimeout(function() {
                    document.body.removeChild(iframe);
                    if (!appOpened) {
                        // App not installed, redirect to website
                        window.location.href = webUrl;
                    }
                }, 1500);
            } else {
                // Desktop or other
                window.location.href = webUrl;
            }
        }

        // Start immediately
        tryOpenApp();
    </script>
</head>
<body>
    <p>Redirecting to Celestial Jewel...</p>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
