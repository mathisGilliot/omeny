// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

interface Config {
    onSuccess?: (registration: ServiceWorkerRegistration) => void;
    onUpdate?: (registration: ServiceWorkerRegistration) => void;
}

function registerValidSW(swUrl: string, config?: Config): void {
    navigator.serviceWorker
        .register(swUrl)
        .then((registration): void => {
            registration.onupdatefound = (): void => {
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                installingWorker.onstatechange = (): void => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // Execute callback
                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            // Execute callback
                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch((error): void => { throw error; });
}

function checkValidServiceWorker(swUrl: string, config?: Config): void {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl)
        .then((response): void => {
            // Ensure service worker exists, and that we really are getting a JS file.
            const contentType = response.headers.get('content-type');
            if (
                response.status === 404 || (contentType != null && contentType.indexOf('javascript') === -1)
            ) {
                // No service worker found. Probably a different app. Reload the page.
                navigator.serviceWorker.ready.then((registration): void => {
                    registration.unregister().then((): void => {
                        window.location.reload();
                    });
                });
            } else {
                // Service worker found. Proceed as normal.
                registerValidSW(swUrl, config);
            }
        });
}

export function register(config?: Config): void {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        // The URL constructor is available in all browsers that support SW.
        const publicUrl = new URL(
            (process as { env: { [key: string]: string } }).env.PUBLIC_URL,
            window.location.href
        );
        if (publicUrl.origin !== window.location.origin) {
            // Our service worker won't work if PUBLIC_URL is on a different origin
            // from what our page is served on. This might happen if a CDN is used to
            // serve assets; see https://github.com/facebook/create-react-app/issues/2374
            return;
        }

        window.addEventListener('load', async (): Promise<void> => {
            const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

            if (isLocalhost) {
                // This is running on localhost. Let's check if a service worker still exists or not.
                checkValidServiceWorker(swUrl, config);

                // Add some additional logging to localhost, pointing developers to the
                // service worker/PWA documentation.
                await navigator.serviceWorker.ready;
            } else {
                // Is not localhost. Just register service worker
                registerValidSW(swUrl, config);
            }
        });
    }
}

export function unregister(): void {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration): void => {
            registration.unregister();
        });
    }
}
