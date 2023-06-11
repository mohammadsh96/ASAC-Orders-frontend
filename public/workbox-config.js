// workbox-config.js

module.exports = {
    "globDirectory": "build/",
    "globPatterns": [
      "**/*.{json,ico,png,html,js,txt,css}"
    ],
    "swDest": "build/service-worker.js",
    "swSrc": "src/service-worker.js",
    "injectionPointRegexp": /(const precacheManifest = )\[\](;)/,
    "templatedUrls": {},
    "maximumFileSizeToCacheInBytes": 5000000,
    "cleanupOutdatedCaches": true,
    "navigateFallback": "/index.html",
    "clientsClaim": true,
    "skipWaiting": true
  };
  