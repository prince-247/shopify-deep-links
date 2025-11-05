export default function handler(req, res) {
  const fullUrl = req.url;
  const productPath = fullUrl.split('/products/')[1];
  const productHandle = productPath ? productPath.split('?')[0] : '';
  
  // Your configuration
  const shopifyDomain = 'celestialjewel.co.in';
  const flutterAppScheme = 'celestialjewel://';
  const appStoreUrl = 'https://apps.apple.com/in/app/celestial-jewels/id6751133452';
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.celestial.jewel.com';

  // Get user agent to detect device
  const userAgent = req.headers['user-agent'] || '';
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  const appDeepLink = `${flutterAppScheme}product/${productHandle}`;
  const webUrl = `https://${shopifyDomain}/products/${productHandle}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Celestial Jewel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- iOS Universal Links Meta Tag -->
    <meta property="al:ios:url" content="celestialjewel://product/${productHandle}">
    <meta property="al:ios:app_store_id" content="6751133452">
    <meta property="al:ios:app_name" content="Celestial Jewel">
    
    <!-- Android Intent -->
    <meta property="al:android:url" content="celestialjewel://product/${productHandle}">
    <meta property="al:android:package" content="com.celestial.jewel.com">
    <meta property="al:android:app_name" content="Celestial Jewel">
    
    <!-- Fallback for non-app users -->
    <meta http-equiv="refresh" content="0;url=${webUrl}">
    
    <script type="text/javascript">
        // Try to open the app immediately
        window.location.href = '${appDeepLink}';
        
        // If app doesn't open, redirect to website after a short delay
        setTimeout(function() {
            window.location.href = '${webUrl}';
        }, 500);
    </script>
</head>
<body>
    <noscript>
        <p>Redirecting to Celestial Jewel...</p>
        <p><a href="${webUrl}">Click here if you are not redirected</a></p>
    </noscript>
</body>
</html>
  `;
  
  res.send(html);
}
