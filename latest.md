# Update - v1.3.0

- Fixed a real bug: the script was checking keywords against the whole URL, including the query string. That meant a normal search page with something like ?q=xxx or ?q=porn in the address would get the entire page blanked out. Now it only checks the hostname and the path, never the query string or hash.
- Domain and link checks now use a proper URL parser instead of raw string matching, so weird or malformed URLs get handled correctly instead of quietly breaking things.
- Added a protocol check so the blocking logic only runs on http and https pages. Browser internal pages, local files, and extension pages are left alone now.
- Wrapped the link scanning in a try/catch that logs errors to the console instead of letting one failure silently stop the script from scanning again later.
- Link parsing also has a safety check now, so broken or unusual hrefs get skipped instead of throwing errors.

# Previous update - v1.2.0

- Combined the keyword and domain lists into one regex so matching only happens once per link instead of looping through two separate arrays.
- Removed the loose "sex" keyword. It was matching things like "Essex" and "sextant" by accident.
- Added word boundaries to keyword matching so partial word matches stop causing false positives.
- Switched domain lookups to a Set for faster checks.
- Added a debounce on the link scanner (150ms) so it doesn't rescan the whole page on every tiny DOM change. This matters a lot on sites with constant updates like infinite scroll feeds.
- Patched pushState and replaceState so the script actually rechecks the URL when a site navigates without a full page reload. The old version only checked the URL once when the page first loaded.
- Fixed the startup observer so it disconnects once the page is ready instead of running forever in the background.
