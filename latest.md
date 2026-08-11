# Latest changes - v1.2.0

- Combined the keyword and domain lists into one regex so matching only happens once per link instead of looping through two separate arrays.
- Removed the loose "sex" keyword, it was matching things like "Essex" and "sextant" by accident.
- Added word boundaries to keyword matching so partial word matches stop causing false positives.
- Switched domain lookups to a Set for faster checks.
- Added a debounce on the link scanner (150ms) so it does not re-scan the whole page on every tiny DOM change. This matters a lot on sites with constant DOM updates like infinite scroll feeds.
- Patched pushState and replaceState so the script actually re-checks the URL when a site navigates without a full page reload. The old version only checked the URL once when the page first loaded.
- Fixed the startup observer so it disconnects once the page is ready instead of continuing to run forever in the background.
