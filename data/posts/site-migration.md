---
title: Site Migration
categories:
    - Cloud
    - Knowledge
date: "2020.04.09T14:11Z"
description: A successful migration to a new professional domain and the lessons learned along the way.
---

## Analysis

I've been thinking about obtaining a more professional domain name for some time now, but didn't actually pull the trigger on it until last week. I ended up purchasing two domains, which may seem silly, but there is some logic behind it.

The two domains I purchased are...

* [davelevine.io](https://www.davelevine.io)
* [distributedcomputing.io](https://distributedcomputing.io)

My reasoning behind it is two-fold — [davelevine.io](https://www.davelevine.io) will serve as my professional domain, while [distributedcomputing.io](https://distributedcomputing.io) will serve as my homelab domain. Additionally, [distributedcomputing.io](https://distributedcomputing.io) really spoke to me and described what I enjoy doing, which became my motivation for purchasing the domain.

Because my homelab is one project and my professional career, in a sense, is another, I wanted to keep them separate. This leads me into the point of this post — site migration.

## Purpose Built

While purchasing a domain is one thing, migrating 30 systems is no small task.

I have everything I work on, professional and homelab, proxied through Cloudflare. Locally, I use a combination of Squid Reverse Proxy and Nginx.

My personal preference is Nginx, although when I first started building my network with purpose, I began using Squid simply because it was easier to use than Nginx. Although most of my subdomains proxy through Squid, I began to quickly realize that this is something I hadn't properly documented.

Updating the mappings within Squid didn't take very long, but was awfully time-consuming. I also needed to generate a new origin certificate to include the new domain name.

Since I still own my previous domain — [dowhatimeant.xyz](https://dowhatimeant.xyz), I decided to just add the subdomain to the existing certificate request through Let's Encrypt. Generating the cert was quick and after revoking the old certificate, I was on my way.

## Migration

I began migrating services that I knew would give me the fewest headaches — mostly Docker containers and smaller pieces of software running within VMs. The biggest challenge I realized as I began moving them one-by-one was how many disparate 3rd party tools would be affected by it.

The first thing I realized was the need to update my email for different services — Reddit, Atlassian (backup KB), etc. This was easy, but still time-consuming.

Next, I needed to update ddclient to continue to make sure that DDNS still kept up to date. As of this posting, I still haven't completely configured it, but that will be tomorrow's project.

Last but not least was updating the CNAME for the custom domain I have through Uptime Robot...which led me to realize I needed to update all my subdomains within Uptime Robot.

## Residuals

At the time of this writing, I still have two subdomains to square away — Nagios XI and pfSense.

I tried updating the domain for Nagios earlier, but after doing so, the domain wouldn't resolve, so I had to revert. It's probably something fairly easy, but I'll get it resolved tomorrow.

The next is pfSense. Because I use pfSense as my firewall/router, it's important that I get this one right or else it will take my entire network down. I made the switch and all seems to be well so far, but I'll need to give it a few days to really make sure.

## Lessons Learned

A few things I learned through this:

* My network is a lot more complex than I realized
* I need to properly document all reverse proxy settings, configurations and locations of the config files.
* There were a few outliers I hadn't accounted for that slowed me down.

All in all, the migration was a success. I'm happy with the new domain, and hopefully I'll stick with it for awhile.
