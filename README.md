## Features

* Blocks common porn websites
* Detects adult URLs and redirects them
* Removes suspicious adult links from normal websites
* Detects common NSFW keywords
* Runs automatically when a page loads
* Lightweight with no external dependencies
* Fully local with no data collection

## Installation

### 1. Install Tampermonkey

Install the Tampermonkey browser extension for your browser.

### 2. Install the script

1. Open Tampermonkey
2. Create a new userscript
3. Delete the default template
4. Paste the contents of `blocky.user.js`
5. Save the script
6. Make sure the script is enabled

## How It Works

The script checks the current hostname and URL when a page begins loading.

If a blocked domain or adult-content pattern is detected, the browser is redirected away from the page.

The script also monitors dynamically added links and removes links that appear to lead toward blocked content.

## Limitations

This script cannot guarantee that every adult website will be blocked.

Tampermonkey operates inside the browser and has limitations against:

* New or unknown domains
* Unusual URLs
* Content hosted on generic platforms
* Embedded content from other domains
* Websites opened before the userscript executes
* Disabling or modifying the userscript

For stronger protection, combine this script with DNS filtering or browser-level blocking.

## Privacy

BlockyNSFW does not:

* Collect browsing history
* Send data to a server
* Use analytics
* Track users
* Require an account
* Require an external API

Everything happens locally in your browser.

Use, modify, and distribute it freely.

## Purpose

BlockyNSFW is intended to make accessing unwanted adult content more difficult and help users maintain better control over their browsing habits.
