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
    let opened = false;

    function openApp() {
      if (isIOS) {
        // iOS: use hidden iframe to avoid "invalid address"
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appLink;
        document.body.appendChild(iframe);
      } else {
        // Android: open app directly
        window.location.href = appLink;
      }

      // If the user doesn't switch to app, open fallback
      setTimeout(() => {
        if (!opened) {
          if (isIOS) {
            window.location.replace(webUrl);
          } else if (isAndroid) {
            window.location.replace(playStore);
          } else {
            window.location.replace(webUrl);
          }
        }
      }, 1500);
    }

    // Detect if user left Safari (means app opened)
    window.addEventListener('pagehide', () => {
      opened = true;
    });
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') opened = true;
    });

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
