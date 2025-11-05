export default function handler(req, res) {
  const fullUrl = req.url;
  const productPath = fullUrl.split('/products/')[1];
  const productHandle = productPath ? productPath.split('?')[0] : '';
  
  const shopifyDomain = 'celestialjewel.co.in';
  const appStoreUrl = 'https://apps.apple.com/in/app/celestial-jewels/id6751133452';
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.celestial.jewel.com';

  const userAgent = req.headers['user-agent'] || '';
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  
  const webUrl = `https://${shopifyDomain}/products/${productHandle}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Celestial Jewel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- iOS Smart App Banner -->
    <meta name="apple-itunes-app" content="app-id=6751133452">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Celestial Jewel">
    <meta property="og:description" content="Beautiful Handcrafted Jewelry">
    <meta property="og:image" content="https://${shopifyDomain}/cdn/shop/files/logo.png">
    <meta property="og:url" content="${webUrl}">
    
    <script type="text/javascript">
        (function() {
            var isIOS = ${isIOS};
            var isAndroid = ${isAndroid};
            var isSafari = ${isSafari};
            var startTime = Date.now();
            var appOpened = false;
            
            // For Universal Links, we don't need to manually open the app
            // iOS will handle it automatically if the app is installed
            
            function redirectToStore() {
                if (isIOS) {
                    window.location.href = '${appStoreUrl}';
                } else if (isAndroid) {
                    window.location.href = '${playStoreUrl}';
                } else {
                    window.location.href = '${webUrl}';
                }
            }
            
            function redirectToWebsite() {
                window.location.href = '${webUrl}';
            }
            
            // If this page is loaded, it means Universal Link didn't open the app
            // So we redirect to the actual website after a short delay
            setTimeout(function() {
                console.log('Universal Link did not open app, redirecting to website');
                redirectToWebsite();
            }, 500);
            
        })();
    </script>
    
    <!-- Immediate redirect as fallback -->
    <meta http-equiv="refresh" content="1;url=${webUrl}">
</head>
<body>
    <noscript>
        <p>Redirecting to Celestial Jewel...</p>
        <p><a href="${webUrl}">Click here to continue to website</a></p>
    </noscript>
</body>
</html>
  `;
  
  res.send(html);
}
