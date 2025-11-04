export default function handler(req, res) {
  const fullUrl = req.url;
  const productPath = fullUrl.split('/products/')[1];
  const productHandle = productPath ? productPath.split('?')[0] : '';
  
  // Your configuration - UPDATE THESE URLs
  const shopifyDomain = 'celestialjewel.co.in';
  const flutterAppScheme = 'celestialjewel://';
  const appStoreUrl = 'https://apps.apple.com/in/app/celestial-jewels/id6751133452'; // Your actual App Store URL
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.celestial.jewel.com'; // Your actual Play Store URL

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
    <title>Redirecting to Celestial Jewel...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="text/javascript">
        (function() {
            var appOpened = false;
            var startTime = Date.now();
            
            // Try to open the app
            function openApp() {
                console.log('Attempting to open app...');
                window.location.href = '${appDeepLink}';
                
                // Set timeout to check if app opened
                setTimeout(function() {
                    if (!appOpened) {
                        console.log('App not detected, redirecting to website...');
                        redirectToWebsite();
                    }
                }, 1500);
            }
            
            function redirectToWebsite() {
                var elapsed = Date.now() - startTime;
                console.log('Redirecting after ' + elapsed + 'ms');
                window.location.href = '${webUrl}';
            }
            
            function redirectToAppStore() {
                window.location.href = '${appStoreUrl}';
            }
            
            function redirectToPlayStore() {
                window.location.href = '${playStoreUrl}';
            }
            
            // Detect if app opened (page becomes hidden)
            window.addEventListener('pagehide', function() {
                appOpened = true;
                console.log('App opened successfully (pagehide)');
            });
            
            window.addEventListener('blur', function() {
                appOpened = true;
                console.log('App opened successfully (blur)');
            });
            
            // For iOS Safari specifically
            if (${isIOS} && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
                console.log('iOS Safari detected');
                // First try to open app
                window.location.href = '${appDeepLink}';
                
                // If still on page after 1.2 seconds, show manual option
                setTimeout(function() {
                    if (!appOpened && document.hasFocus()) {
                        console.log('iOS Safari: App not installed, showing manual option');
                        document.getElementById('iosFallback').style.display = 'block';
                    }
                }, 1200);
                
                // Final fallback after 3 seconds
                setTimeout(function() {
                    if (!appOpened && document.hasFocus()) {
                        console.log('iOS Safari: Final fallback to website');
                        redirectToWebsite();
                    }
                }, 3000);
            } else {
                // For other browsers
                console.log('Non-iOS Safari browser detected');
                openApp();
                
                // Final fallback for all devices
                setTimeout(function() {
                    if (!appOpened) {
                        console.log('Final fallback to appropriate destination');
                        if (${isIOS}) {
                            redirectToAppStore();
                        } else if (${isAndroid}) {
                            redirectToPlayStore();
                        } else {
                            redirectToWebsite();
                        }
                    }
                }, 2500);
            }
            
            // Manual open for iOS
            window.openAppManually = function() {
                window.location.href = '${appDeepLink}';
                setTimeout(function() {
                    if (!appOpened) {
                        redirectToWebsite();
                    }
                }, 1000);
            };
            
        })();
    </script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 400px;
        }
        .spinner {
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .fallback {
            display: none;
            margin-top: 20px;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }
        button {
            background: white;
            color: #667eea;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            margin: 10px 5px;
        }
        a {
            color: white;
            text-decoration: underline;
            display: block;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌙 Celestial Jewel</h1>
        <p>Opening the app...</p>
        <div class="spinner"></div>
        
        <!-- iOS Fallback for when automatic open fails -->
        <div id="iosFallback" class="fallback">
            <p>Having trouble opening the app?</p>
            <button onclick="openAppManually()">Open in App</button>
            <br>
            <a href="${webUrl}">Open in Browser Instead</a>
        </div>
        
        <!-- Direct link for all users -->
        <div style="margin-top: 20px;">
            <a href="${webUrl}">Continue to Website</a>
        </div>
    </div>
</body>
</html>
  `;
  
  res.send(html);
}
