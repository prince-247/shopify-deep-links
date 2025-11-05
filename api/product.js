export default function handler(req, res) {
  const { query } = req;
  const productHandle = req.url.split('/products/')[1];

  // Your Shopify domain
  const shopifyDomain = 'celestialjewel.co.in';
  const flutterAppScheme = 'celestialjewel://';
  const appStoreUrl = 'https://apps.apple.com/in/app/celestial-jewels/id6751133452'; // iOS App Store
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=your.package.name'; // Google Play

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
        // Device detection variables
        const isIOS = ${isIOS};
        const isAndroid = ${isAndroid};

        function openApp() {
            if (isIOS) {
                // Use iframe for iOS to avoid invalid address error
                var iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = '${appDeepLink}';
                document.body.appendChild(iframe);
                
                // Fallback to website after delay
                setTimeout(function() {
                    window.location.href = '${webUrl}';
                }, 2000);
            } else if (isAndroid) {
                window.location.href = '${appDeepLink}';
                
                setTimeout(function() {
                    window.location.href = '${playStoreUrl}';
                }, 1000);
            } else {
                window.location.href = '${webUrl}';
            }
        }

        // Start opening app when page loads
        window.onload = openApp;
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
