export default function handler(req, res) {
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

    const appLink = '${appDeepLink}';
    const appStore = '${appStoreUrl}';
    const playStore = '${playStoreUrl}';
    const webUrl = '${webUrl}';

    function tryOpenApp() {
      const now = Date.now();
      const timeout = 1500;

      // Set up fallback
      let hasVisibilityChanged = false;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          hasVisibilityChanged = true;
        }
      });

      // Try opening app
      window.location.href = appLink;

      // After delay, fallback if app didn’t open
      setTimeout(() => {
        if (!hasVisibilityChanged) {
          if (isIOS) {
            window.location.replace(webUrl);  // ✅ open website if app not installed
          } else if (isAndroid) {
            window.location.replace(playStore);
          } else {
            window.location.replace(webUrl);
          }
        }
      }, timeout);
    }

    window.onload = tryOpenApp;
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
