// ==UserScript==
// @name         BlockyNSFW - By Eskrid
// @namespace    local.gooning.quit
// @version      1.2.0
// @description  Blocks adult websites and removes adult-content links.
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @author       Eskrid
// ==/UserScript==
(() => {
    'use strict';

    const REDIRECT_TARGET = 'about:blank';
    const SCAN_DEBOUNCE_MS = 150;

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

    const BLOCKED_KEYWORD_PATTERN = new RegExp(
        `\\b(${['porn', 'xxx', 'nsfw', 'hentai', 'rule34', ...BLOCKED_DOMAINS].join('|')})\\b`,
        'i'
    );

    const redirect = () => {
        location.replace(REDIRECT_TARGET);
    };

    const isBlockedHost = host => {
        return [...BLOCKED_DOMAINS].some(domain => host === domain || host.endsWith(`.${domain}`));
    };

    const isBlockedUrl = url => {
        return BLOCKED_PATH_PATTERN.test(url) || BLOCKED_KEYWORD_PATTERN.test(url);
    };

    const isBlockedText = text => BLOCKED_KEYWORD_PATTERN.test(text);

    const checkCurrentLocation = () => {
        if (isBlockedHost(location.hostname.toLowerCase()) || isBlockedUrl(location.href)) {
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
            if (isBlockedUrl(link.href) || isBlockedText(link.textContent || '')) {
                link.remove();
            }
        });
    };

    let scanTimer = null;
    const scheduleScan = root => {
        if (scanTimer !== null) {
            return;
        }
        scanTimer = setTimeout(() => {
            scanTimer = null;
            scanLinks(root);
        }, SCAN_DEBOUNCE_MS);
    };

    const startObserver = () => {
        scanLinks(document.documentElement);
        new MutationObserver(() => scheduleScan(document.documentElement)).observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    };

    const patchHistoryNavigation = () => {
        const notify = () => {
            if (!checkCurrentLocation()) {
                scanLinks(document.documentElement);
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
