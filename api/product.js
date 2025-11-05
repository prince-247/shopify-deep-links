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
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  
  const appDeepLink = `${flutterAppScheme}product/${productHandle}`;
  const webUrl = `https://${shopifyDomain}/products/${productHandle}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // For iOS Safari, we need a different approach
  if (isIOS && isSafari) {
    const iosHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Celestial Jewel - Open in App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="apple-itunes-app" content="app-id=6751133452">
    <script type="text/javascript">
        let appOpened = false;
        let redirectTimer;

        function openApp() {
            console.log('Attempting to open app...');
            
            // First, try to open the app using Universal Link
            window.location.href = '${appDeepLink}';
            
            // Set a timer to check if we're still on this page
            redirectTimer = setTimeout(function() {
                if (!appOpened) {
                    console.log('App not installed, showing options...');
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('fallback').style.display = 'block';
                }
            }, 1200);
        }

        function openAppDirectly() {
            console.log('Manual app open attempt...');
            window.location.href = '${appDeepLink}';
            
            setTimeout(function() {
                if (!appOpened) {
                    redirectToWebsite();
                }
            }, 1000);
        }

        function redirectToWebsite() {
            console.log('Redirecting to website...');
            window.location.href = '${webUrl}';
        }

        function redirectToAppStore() {
            console.log('Redirecting to App Store...');
            window.location.href = '${appStoreUrl}';
        }

        // Detect if app opened
        window.addEventListener('pagehide', function() {
            appOpened = true;
            clearTimeout(redirectTimer);
        });

        window.addEventListener('blur', function() {
            appOpened = true;
            clearTimeout(redirectTimer);
        });

        // Start the process when page loads
        window.onload = function() {
            openApp();
            
            // Final fallback after 5 seconds
            setTimeout(function() {
                if (!appOpened) {
                    console.log('Final fallback to website');
                    redirectToWebsite();
                }
            }, 5000);
        };
    </script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 400px;
            width: 100%;
        }
        .logo {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .title {
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        .description {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            line-height: 1.5;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 2rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .button {
            background: white;
            color: #667eea;
            border: none;
            padding: 15px 30px;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 25px;
            cursor: pointer;
            margin: 10px 0;
            width: 100%;
            max-width: 280px;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .button-outline {
            background: transparent;
            color: white;
            border: 2px solid white;
        }
        .link {
            color: white;
            text-decoration: underline;
            margin-top: 15px;
            display: inline-block;
        }
        .hidden {
            display: none;
        }
        .options {
            margin-top: 2rem;
        }
        .option-item {
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🌙</div>
        <h1 class="title">Celestial Jewel</h1>
        
        <!-- Loading State -->
        <div id="loading">
            <p class="description">Opening the app...</p>
            <div class="spinner"></div>
        </div>
        
        <!-- Fallback Options (shown when app not installed) -->
        <div id="fallback" class="hidden">
            <p class="description">Open this product in:</p>
            
            <div class="options">
                <div class="option-item">
                    <button class="button" onclick="openAppDirectly()">
                        📱 Open in App
                    </button>
                </div>
                
                <div class="option-item">
                    <button class="button button-outline" onclick="redirectToWebsite()">
                        🌐 Open in Browser
                    </button>
                </div>
                
                <div class="option-item">
                    <button class="button button-outline" onclick="redirectToAppStore()">
                        ⬇️ Get the App
                    </button>
                </div>
            </div>
            
            <a href="${webUrl}" class="link">Continue to Website</a>
        </div>
    </div>
</body>
</html>
    `;
    res.send(iosHtml);
  } else {
    // For Android and other browsers - use the existing working approach
    const universalHtml = `
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
            
            function openApp() {
                console.log('Attempting to open app...');
                window.location.href = '${appDeepLink}';
                
                setTimeout(function() {
                    if (!appOpened) {
                        console.log('App not detected, redirecting...');
                        redirectToDestination();
                    }
                }, 1000);
            }
            
            function redirectToDestination() {
                if (${isAndroid}) {
                    window.location.href = '${playStoreUrl}';
                } else {
                    window.location.href = '${webUrl}';
                }
            }
            
            window.addEventListener('pagehide', function() {
                appOpened = true;
            });
            
            window.addEventListener('blur', function() {
                appOpened = true;
            });
            
            openApp();
            
            setTimeout(function() {
                if (!appOpened) {
                    redirectToDestination();
                }
            }, 2500);
            
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
    </style>
</head>
<body>
    <div>
        <h1>🌙 Celestial Jewel</h1>
        <p>Opening the app...</p>
        <div class="spinner"></div>
        <p style="margin-top: 20px;">
            <a href="${webUrl}" style="color: white; text-decoration: underline;">
                Open in Browser Instead
            </a>
        </p>
    </div>
</body>
</html>
    `;
    res.send(universalHtml);
  }
}
