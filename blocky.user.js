// ==UserScript==
// @name         BlockyNSFW - By Eskrid
// @namespace    local.gooning.quit
// @version      1.3.0
// @description  Blocks adult websites and removes adult-content links.
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @author       Eskrid
// @license      MIT
// ==/UserScript==
(() => {
    'use strict';

    const REDIRECT_TARGET = 'about:blank';
    const SCAN_DEBOUNCE_MS = 150;
    const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

    const BLOCKED_DOMAINS = new Set([
        'pornhub',
        'xvideos',
        'xnxx',
        'xhamster',
        'redtube',
        'youporn',
        'spankbang',
        'rule34',
        'hentai',
        'nhentai',
        'hanime',
        'chaturbate',
        'brazzers',
        'onlyfans',
        'erome'
    ]);

    const BLOCKED_PATH_PATTERN = /\/(porn|xxx|nsfw|hentai|adult)(?:\/|$)/i;

    const BLOCKED_TEXT_PATTERN = new RegExp(
        `\\b(${['porn', 'xxx', 'nsfw', 'hentai', 'rule34', ...BLOCKED_DOMAINS].join('|')})\\b`,
        'i'
    );

    const redirect = () => {
        location.replace(REDIRECT_TARGET);
    };

    const isBlockedHost = host => {
        for (const domain of BLOCKED_DOMAINS) {
            if (host === domain || host.endsWith(`.${domain}`)) {
                return true;
            }
        }
        return false;
    };

    const parseUrl = raw => {
        try {
            return new URL(raw, location.href);
        } catch {
            return null;
        }
    };

    const isBlockedPageUrl = url => {
        if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
            return false;
        }
        const host = url.hostname.toLowerCase();
        return isBlockedHost(host) || BLOCKED_PATH_PATTERN.test(url.pathname);
    };

    const isBlockedLink = url => {
        return isBlockedPageUrl(url) || BLOCKED_TEXT_PATTERN.test(url.pathname);
    };

    const checkCurrentLocation = () => {
        const url = parseUrl(location.href);
        if (url && isBlockedPageUrl(url)) {
            redirect();
            return true;
        }
        return false;
    };

    if (checkCurrentLocation()) {
        return;
    }

    const scanLinks = root => {
        root.querySelectorAll('a[href]').forEach(link => {
            const url = parseUrl(link.href);
            if (!url) {
                return;
            }
            if (isBlockedLink(url) || BLOCKED_TEXT_PATTERN.test(link.textContent || '')) {
                link.remove();
            }
        });
    };

    const safeScan = root => {
        try {
            scanLinks(root);
        } catch (error) {
            console.error('BlockyNSFW scan failed:', error);
        }
    };

    let scanTimer = null;
    const scheduleScan = root => {
        if (scanTimer !== null) {
            return;
        }
        scanTimer = setTimeout(() => {
            scanTimer = null;
            safeScan(root);
        }, SCAN_DEBOUNCE_MS);
    };

    const startObserver = () => {
        safeScan(document.documentElement);
        new MutationObserver(() => scheduleScan(document.documentElement)).observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    };

    const patchHistoryNavigation = () => {
        const notify = () => {
            if (!checkCurrentLocation()) {
                safeScan(document.documentElement);
            }
        };
        const wrap = method => {
            const original = history[method];
            history[method] = function (...args) {
                const result = original.apply(this, args);
                notify();
                return result;
            };
        };
        wrap('pushState');
        wrap('replaceState');
        window.addEventListener('popstate', notify);
    };

    const init = () => {
        startObserver();
        patchHistoryNavigation();
    };

    if (document.documentElement) {
        init();
    } else {
        new MutationObserver((_, observer) => {
            if (document.documentElement) {
                observer.disconnect();
                init();
            }
        }).observe(document, { childList: true, subtree: true });
    }
})();
