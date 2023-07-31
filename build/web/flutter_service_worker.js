'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"index.html": "c7ff1f26b7df9d2c7c2927a22bdb7efe",
"/": "c7ff1f26b7df9d2c7c2927a22bdb7efe",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"main.dart.js": "2502eaf032ca9d7014148bbc3b26c0c5",
"version.json": "68de742a7fcb6e00fffafe21b3f8df02",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"manifest.json": "4fb8d85958fad4331cb5519ed11e87f7",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/fonts/MaterialIcons-Regular.otf": "24593f405b0b986740dc427c0798046a",
"assets/AssetManifest.bin": "a02df986ed860533020c185101f745a8",
"assets/AssetManifest.json": "467c084e4964b229bc8b826ac86bb445",
"assets/NOTICES": "8a041c8bf3827b71137be8f693492bc5",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/assets/data/portfolio.json": "9383bd4cdcc1636c9715df3f0b6480ad",
"assets/assets/data/experience.json": "8946ac23e08e8e51d7687444ae0eecc9",
"assets/assets/data/profile.json": "a5e238eaef90ecfb309b2a55d46125d1",
"assets/assets/data/skills.json": "415e6652671e6f91286579a7a4f57e13",
"assets/assets/data/temp.txt": "7b9e0f2fef5def7dcea7bc9c1d9c9827",
"assets/assets/data/about_me.json": "3c69533768100a1cfafc6ea0a20593b1",
"assets/assets/rive/robo_sketch.riv": "7623ebadf291282530be7ac1943c2ae2",
"assets/assets/rive/hero_image.riv": "fc89078900b3bda49c5fa4dd23aaa469",
"assets/assets/rive/hero_background.riv": "9cee43f26073742de5043140add454a8",
"assets/assets/rive/badass_grandpa.riv": "cb31852ded2e7254aa427682e877b3ac",
"assets/assets/images/profile_image.png": "b967c616ff599c52d59cd6cf8ff7e759",
"assets/assets/images/flutter_small.png": "48f83cd956f840b946e4449bf90537cb",
"assets/assets/images/firebase.png": "e9c691a7a574afac430fcb406be57cf4",
"assets/assets/images/nodejs.png": "cd1ecdbc98e88285bdc1d08543eee4a1",
"assets/assets/images/portfolio/witty.png": "7ea3d29e774557f2e9ad87dbecf6d360",
"assets/assets/images/portfolio/relative_scale.png": "15aa442a478dfff6d785b56408ecfc9e",
"assets/assets/images/portfolio/momentum.png": "cba3d6bc14763d5d1fcf8f1626553fe2",
"assets/assets/images/portfolio/orbit.png": "de03fbf1a52f22ac9ecbfbf78acccad4",
"assets/assets/images/portfolio/pspayment.png": "3d55b79fab6e5802b6f52178c93f4c31",
"assets/assets/images/portfolio/quantz.png": "64a12aff2e0b287dee218f8c8325c0d7",
"assets/assets/images/portfolio/btx.png": "e202f3a8bfdad6c1f2b1fc12915a86b6",
"assets/assets/images/portfolio/beaconforce.png": "e388f3b7ceab20dc24700289c20daaef",
"assets/assets/images/portfolio/portfolio.png": "d61e03863cb5a2b5b100b452e542be60",
"assets/assets/images/portfolio/owensmx.png": "6d9a318f6091c114c860b0d23d379842",
"assets/assets/images/progile_image.jpg": "62a4faafe257eeaa71827f891f0b594b",
"assets/assets/images/flutter.png": "ac9a721a12bbc803b44f645561ecb1e1",
"assets/assets/images/github_actions.png": "dc30fd9a0af62e9dad9475e6943f348c",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
