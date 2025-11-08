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
    <p>Redirecting...</p>
    
    <script type="text/javascript">
        (function() {
            const isIOS = ${isIOS};
            const isAndroid = ${isAndroid};
            const appDeepLink = '${appDeepLink}';
            const webUrl = '${webUrl}';

            let startTime = new Date().getTime();
            let appOpened = false;

            // Event listeners to detect app opening
            window.addEventListener('blur', function() {
                appOpened = true;
            });

            window.addEventListener('pagehide', function() {
                appOpened = true;
            });

            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    appOpened = true;
                }
            });

            function tryOpenApp() {
                if (isAndroid) {
                    // Android: Try app first
                    window.location.href = appDeepLink;
                    
                    // Check after 1.5 seconds if app opened
                    setTimeout(function() {
                        let endTime = new Date().getTime();
                        // If more than 1.5 seconds passed and page is still visible, app didn't open
                        if (!appOpened && (endTime - startTime) < 2000) {
                            window.location.href = webUrl;
                        } else if (!appOpened) {
                            // App likely opened (took time), but just in case
                            window.location.href = webUrl;
                        }
                    }, 1500);
                    
                } else if (isIOS) {
                    // iOS: Use hidden iframe to try opening app without error
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);
                    
                    // Try to open app via iframe
                    iframe.src = appDeepLink;
                    
                    // Check after 1.5 seconds
                    setTimeout(function() {
                        // Remove iframe
                        try {
                            document.body.removeChild(iframe);
                        } catch(e) {}
                        
                        // If app didn't open, go to website
                        if (!appOpened) {
                            window.location.href = webUrl;
                        }
                    }, 1500);
                    
                } else {
                    // Desktop or other - go directly to website
                    window.location.href = webUrl;
                }
            }

            // Start the process
            tryOpenApp();
        })();
    </script>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
