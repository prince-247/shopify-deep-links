export default function handler(req, res) {
  const productHandle = req.url.split('/products/')[1]?.split('?')[0] || '';

  const shopifyDomain = 'celestialjewel.co.in';
  const flutterAppScheme = 'celestialjewel://';
  const appStoreUrl = 'https://apps.apple.com/in/app/celestial-jewels/id6751133452';
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.celestial.jewel.com';

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
    <title>Opening Celestial Jewel...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
        }
        .spinner {
            border: 4px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="spinner"></div>
    <p>Opening product...</p>
    
    <script type="text/javascript">
        (function() {
            const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            const appDeepLink = '${appDeepLink}';
            const webUrl = '${webUrl}';
            
            if (isIOS) {
                // iOS: Try to open app, fallback to WEBSITE (not App Store)
                let appOpened = false;
                let startTime = Date.now();
                
                // Create hidden iframe to trigger app open
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.style.width = '0';
                iframe.style.height = '0';
                iframe.src = appDeepLink;
                document.body.appendChild(iframe);
                
                // Use visibilitychange to detect if app opened
                document.addEventListener('visibilitychange', function() {
                    if (document.hidden) {
                        appOpened = true;
                    }
                });
                
                // Use pagehide as backup detection
                window.addEventListener('pagehide', function() {
                    appOpened = true;
                });
                
                // Fallback to WEBSITE if app doesn't open
                setTimeout(function() {
                    // Remove iframe
                    if (iframe && iframe.parentNode) {
                        document.body.removeChild(iframe);
                    }
                    
                    // Check if app opened by checking time elapsed and visibility
                    const elapsed = Date.now() - startTime;
                    
                    // If app didn't open, redirect to WEBSITE
                    if (!appOpened && !document.hidden && elapsed < 3000) {
                        window.location.href = webUrl;
                    }
                }, 2500);
                
            } else if (isAndroid) {
                // Android: Use intent with website fallback
                const intentUrl = 'intent://product/' + encodeURIComponent('${productHandle}') + 
                    '#Intent;scheme=celestialjewel;package=com.celestial.jewel.com;' +
                    'S.browser_fallback_url=' + encodeURIComponent(webUrl) + ';end';
                
                window.location.href = intentUrl;
                
            } else {
                // Desktop or other devices: redirect to website
                setTimeout(function() {
                    window.location.href = webUrl;
                }, 500);
            }
        })();
    </script>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
