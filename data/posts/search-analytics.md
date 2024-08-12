---
title: Search Analytics
categories:
    - Knowledge
    - Tools
date: "2021.08.19"
description: Searx has built-in statistics but doesn't support external analytics, prompting my curiosity about traffic to my instance beyond my own visits.
---

## Summary

Although [Searx](https://github.com/searx/searx) comes with its own built in statistics, it doesn't natively allow for adding analytics. This is largely by design considering the privacy aspect of the project. However, I was curious to see if my instance gets any traffic that isn't from me.

<!-- more -->

## Trial and Error

In order to do this, I had to find out where the `base.html` file was located. This was confusing to find because the Searx config file resides in `/etc/searx`, although after some digging, I found `base.html` in the following directory...

`/usr/local/searx/searx-src/searx/templates/oscar`

Once in the directory, I tried adding the following...

```html
  <!--Plausible Analytics-->
  <script defer data-domain="search.cc" data-api="/data/api/event" src="/data/js/script.js"></script>
```

This would allow me to [proxy the tracking snippet](https://plausible.io/docs/proxy/guides/cloudflare) through Cloudflare. I've already done this with most of the other services I manage, but for some reason, the tracking snippet kept returning a 404 error.

The site was correct, - `https://search.cc/data/js/script.js` - but would not return the tracking snippet. After a lot of trial and error, I found that the tracking snippet was available at `https://www.search.cc/data/js/script.js`. I checked the `settings.yml` file for Searx, as well as my configuration in Cloudflare, but could not find where the `www` was coming from.

## Resolution

Because I wasn't able to locate where the `www` was coming from in the tracking snippet, I decided to [proxy the snippet through Nginx](https://plausible.io/docs/proxy/guides/nginx). Since I already use Nginx as the web server for Searx, it wasn't a big deal to modify the config file.

To modify the config file, I added the following:

```nginx
# Only needed if you cache the plausible script. Speeds things up.
proxy_cache_path /var/run/nginx-cache/jscache levels=1:2 keys_zone=jscache:100m inactive=30d  use_temp_path=off max_size=100m;

server {
    ...
    location = /js/script.js {
        # Change this if you use a different variant of the script
        proxy_pass https://plausible.io/js/plausible.js;

        # Tiny, negligible performance improvement. Very optional.
        proxy_buffering on;

        # Cache the script for 6 hours, as long as plausible.io returns a valid response
        proxy_cache jscache;
        proxy_cache_valid 200 6h;
        proxy_cache_use_stale updating error timeout invalid_header http_500;

        # Optional. Adds a header to tell if you got a cache hit or miss
        add_header X-Cache $upstream_cache_status;
    }

    location = /api/event {
        proxy_pass https://plausible.io/api/event;
        proxy_buffering on;
        proxy_http_version 1.1;

        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
    }
```

After reloading Nginx, I navigated back to `/usr/local/searx/searx-src/searx/templates/oscar` and added the following to `base.html`...

```html
  <!--Plausible Analytics-->
<script defer data-api="https://search.cc/api/event" data-domain="search.cc" src="https://search.cc/js/script.js"></script>
```

Once this was added, I navigated back to `/usr/local/searx/searx-src` and used the following command to update the Searx instance...

```bash
sudo -H ./utils/searx.sh update searx
```

During the update, I made sure to keep the same config file.

## Testing

Once it was finished, I did the following...

* Navigated back to my browser.
* Opened the Developer Console.
* Navigated to the `Network` tab.
* Loaded `https://search.cc`
* Confirmed the script appeared at `https://search.cc/js/script.js`

## Outcome

Although it's not perfect, it so far seems to be giving me what I'm looking for. I'd like to figure out how to get insight into usage from searching through a browser address bar, but I have a feeling this may be a bit of a limitation with either Plausible or Searx; likely the latter. I think it has something to do with Content Security Policy in Nginx, but I haven't dug far enough into it to be sure.

The important thing is that I was able to configure it properly so that analytics are implemented and the tracking snippet is served from the `search.cc` domain.

## Resources

* <https://plausible.io/docs/proxy/guides/cloudflare>
* <https://plausible.io/docs/proxy/guides/nginx>
