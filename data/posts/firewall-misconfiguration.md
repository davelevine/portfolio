---
title: Firewall Misconfiguration
authors: [davelevine]
categories:
    - Knowledge
    - Security
date: "2020-10-04"
description: Much to my chagrin, I find myself making a configuration change that I have high hopes for, but ends up causing more problems than it solves. This is no different from what happened to me a few days ago by making a firewall change on my homelab.
---

<!--markdownlint-disable-->

## Primer

Much to my chagrin, I find myself making a configuration change that I have high hopes for, but ends up causing more problems than it solves. This is no different from what happened to me a few days ago by making a firewall change on my homelab.

<!-- more -->

## What I wanted to do

First, some background...

I don't believe I've ever posted about it (although I should), but I've grown quite the distaste for monitoring dashboards. For me, there always seems to be something missing or leaving a lot to be desired. It usually boils down to one or more of the following:

- Functionality
- UI/UX
- Too expensive
- Time spent configuring

I could have an entirely separate post about this to go into detail, but the bottom line is that I want a dashboard that looks great that doesn't cost me an entire paycheck and won't take me eons to configure. Asking a lot, right?

Well, in deciding to no longer go that route, I've put the effort into connecting as many services as I can to Slack. This way, if something happens, I'll immediately get a notification about it instead of having to rely on looking at a monitoring dashboard.

My current notification setup is as follows:

<Image src="https://cdn.levine.io/uploads/images/gallery/2020-10/Tv2MhDAaCI67cYgE-slack-mind-map.png" alt="Slack Mind Map" />

All that long-winded explanation aside, the downside to this is how nice Cloudflare and Uptime Robot play with pfSense. All of my services are monitored in some form by Uptime Robot, but everything in my homelab goes...

pfSense > Cloudflare > Uptime Robot > etc

The problem is that after a few days, I begin receiving notifications from Uptime Robot that my internal services are down with a resulting 503 or 522 error. The services, however, aren't actually down, but for some reason, Cloudflare thinks otherwise.

I've run through countless configuration changes in Cloudflare to make sure it plays nice with Uptime Robot, even going so far as to whitelist all the Uptime Robot IP ranges in Cloudflare. However, the problem remains.

I figured it might be worthwhile to whitelist the [Cloudflare IPs](https://www.cloudflare.com/ips-v4) on pfSense.

I created this whitelist in pfSense under `pfBlockerNG > IP > IPv4` and set it to `Permit Outbound`. Updated the service and everything seemed to be running as it should.

This brings us to the present.

## What I ended up doing

Yesterday, I added a handful of movies to Plex, which uploaded just fine. However, I noticed that the metadata wasn't automatically being pulled in.

This is unusual because my Plex VM has become incredibly self-sufficient, so everything about it is now 'set it and forget it'.

I tried pulling in the metadata manually, but noticed that it wasn't finding any. The metadata pulls in from the following two sources:

- [The Movie Database](https://www.themoviedb.org)
- [TheTVDB](https://thetvdb.com)

I let it go overnight because I didn't have the time to troubleshoot further. Fast-forward to today...

Again, I tried pulling the metadata in manually and found it still not working. I rebooted the Plex VM; no change. I used ssh to check the VM after noticing that Plex was a version behind. This is highly unusual since I have a [script](https://github.com/mrworf/plexupdate) that runs daily to check/update Plex as needed. The script runs flawlessly so Plex is up to date 99.9% of the time.

I tried running the script manually to try and fetch the latest version. This is where I noticed that the script was hanging and ultimately failed when trying to download the [.deb package](https://downloads.plex.tv/plex-media-server-new/1.20.2.3370-b1b651549/debian/plexmediaserver_1.20.2.3370-b1b651549_amd64.deb).

Used Xen Orchestra to get into the GUI for the Plex VM to check for anything unusual. Disconnected and reconnected the network interface; no change. Went for broke and tried to download the .deb package manually through the browser, only to find that the page wouldn't resolve for <https://plex.tv>.

I checked on both my MacBook Pro and my Manjaro box and both were able to resolve the site without an issue. Tried <https://bitwarden.com>, just because it was in my “top sites”; same issue. The Plex site is hosted on AWS, but low and behold, running a traceroute on <https://downloads.plex.tv> shows it resolving to — you guessed it — a Cloudflare IP. It's very likely their whole infrastructure is on AWS, but they use Cloudflare CDN.

## How I resolved it

At this point, I was nearly convinced there was something wrong with the VM. I looked for a recent snapshot and kicked myself because the last snapshot was two months ago (this VM has gotten so large that I can no longer create an incremental backup because of Xen Orchestra limitations; another story for another time). This is when I remembered that the only other change I made was the addition of the Cloudflare IPs to pfBlockerNG.

I logged back into pfSense and removed the Cloudflare IP list from pfBlockerNG, then updated it. Went back to the Plex VM and tried using the browser again; it's now working fine. Tried to download the .deb package again; downloaded without an issue. Logged back into Plex to find that all the metadata was now there.

I realized that what I did was permit traffic outbound, but not inbound. Effectively, I blocked all Cloudflare IP ranges coming into my network. It didn't occur to me that anything was wrong because I was still able to access my sites hosted by Cloudflare because traffic was flowing outbound.

Problem solved? Not quite. I still wanted to get the Cloudflare IPs whitelisted on pfSense.

Because of an authentication issue I had awhile back with getting Plex working on one of my restricted VLANs, I setup an alias to allow traffic from <https://plex.tv> to that particular VLAN. This has been tremendously helpful, so I figured I may get lucky with doing the same for the Cloudflare IPs.

I went into `Firewall > Aliases > URLs` and added the [Cloudflare IPs](https://www.cloudflare.com/ips-v4) site. Navigated to `Firewall > Rules` and created the following firewall rule:

- `Action`: Pass
- `Interface`: WAN
- `Source`: Single host or alias | Cloudflare alias
- `Destination`: LAN Net
- `Gateway`: WAN_DHCP

As of the time of this writing, it's only been about 6 hours since I made this change, so it may be too soon to tell. However, things have been stable, and I haven't received any notifications. I'll continue to monitor things and update if necessary, but hopefully I won't have to.
