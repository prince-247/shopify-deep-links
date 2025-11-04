export default function handler(req, res) {
  const { query } = req;
  const productHandle = req.url.split('/products/')[1];

  // Your Shopify domain
  const shopifyDomain = 'celestialjewel.co.in';
  const flutterAppScheme = 'celestialjewel://';
  const appStoreUrl = 'https://apps.apple.com/in/app/celestial-jewels/id6751133452'; // iOS App Store
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.celestial.jewel.com'; // Google Play

  // Get user agent to detect device
  const userAgent = req.headers['user-agent'] || '';
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  // Product URL in your app
  const appDeepLink = `${flutterAppScheme}product/${productHandle}`;

  // Product URL on Shopify website
  const webUrl = `https://${shopifyDomain}/products/${productHandle}`;

  // HTML page with meta refresh and intent schemes
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript">
        function openApp() {
            // Try to open the app
            window.location.href = '${appDeepLink}';

            // If app is not installed, redirect to store after delay
            setTimeout(function() {
                if (isIOS) {
                    window.location.href = '${appStoreUrl}';
                } else if (isAndroid) {
                    window.location.href = '${playStoreUrl}';
                } else {
                    window.location.href = '${webUrl}';
                }
            }, 1000);
        }

        // Detect if the app was opened successfully
        let appOpened = false;
        window.onblur = function() {
            appOpened = true;
        };

        // Start the process
        setTimeout(function() {
            if (!appOpened) {
                if (${isIOS}) {
                    window.location.href = '${appStoreUrl}';
                } else if (${isAndroid}) {
                    window.location.href = '${playStoreUrl}';
                } else {
                    window.location.href = '${webUrl}';
                }
            }
        }, 1500);
        // Start opening app
        openApp();
    </script>
</head>
<body>
    <p>Redirecting to Celestial Jewel app...</p>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
