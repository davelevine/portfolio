---
title: Firewall Misconfiguration
categories:
    - Case Studies
    - Security
date: "2020.10.04"
description: A recent firewall change in my homelab led to unexpected issues instead of improvements.
---


## Primer

Much to my dismay, I often find myself making a configuration change with high hopes, only to encounter more problems than solutions. This was exactly the case a few days ago when I made a firewall change on my homelab.

## What I Wanted to Do

First, some background...

I don't believe I've ever posted about it (although I should), but I've grown quite a distaste for monitoring dashboards. There always seems to be something missing or unsatisfactory, usually boiling down to one or more of the following:

- Functionality
- UI/UX
- Cost
- Time spent configuring

I could write an entirely separate post about this, but the bottom line is that I want a dashboard that looks great, doesn't cost an entire paycheck, and won't take eons to configure. Asking a lot, right?

In deciding to no longer go that route, I've focused on connecting as many services as I can to Slack. This way, if something happens, I'll immediately get a notification instead of relying on a monitoring dashboard.

My current notification setup is as follows:

![Slack Mind Map](https://cdn.levine.io/uploads/images/gallery/2020-10/Tv2MhDAaCI67cYgE-slack-mind-map.png)

With that explanation aside, the downside is how nicely Cloudflare and Uptime Robot work with pfSense. All my services are monitored in some form by Uptime Robot, but everything in my homelab goes through:

pfSense > Cloudflare > Uptime Robot > etc.

The problem is that after a few days, I begin receiving notifications from Uptime Robot that my internal services are down, resulting in a 503 or 522 error. The services, however, aren't actually down; for some reason, Cloudflare thinks otherwise.

I've gone through countless configuration changes in Cloudflare to ensure it plays nicely with Uptime Robot, even allowlisting all Uptime Robot IP ranges in Cloudflare. However, the problem persists.

I figured it might be worthwhile to allowlist the [Cloudflare IPs](https://www.cloudflare.com/ips-v4) on pfSense.

I created this allowlist in pfSense under `pfBlockerNG > IP > IPv4` and set it to `Permit Outbound`. However, this configuration only permits outbound traffic and does not allow inbound traffic from Cloudflare, which is essential for the services to function correctly. Both outbound and inbound traffic must be allowed for proper communication. I updated the service, and everything seemed to be running as it should.

This brings us to the present.

## What I Ended Up Doing

Yesterday, I added a handful of movies to Plex, which uploaded just fine. However, I noticed that the metadata wasn't automatically being pulled in.

This is unusual because my Plex VM has become incredibly self-sufficient, so everything about it is now 'set it and forget it'.

I tried pulling in the metadata manually, but noticed that it wasn't finding any. The metadata pulls in from the following two sources:

- [The Movie Database](https://www.themoviedb.org)
- [TheTVDB](https://thetvdb.com)

I let it go overnight because I didn't have the time to troubleshoot further. Fast-forward to today...

Again, I tried pulling the metadata in manually and found it still not working. I rebooted the Plex VM; no change. I used SSH to check the VM after noticing that Plex was a version behind. This is highly unusual since I have a [script](https://github.com/mrworf/plexupdate) that runs daily to check/update Plex as needed. The script runs flawlessly, so Plex is up to date 99.9% of the time.

I tried running the script manually to fetch the latest version. This is where I noticed that the script was hanging and ultimately failed when trying to download the [.deb package](https://downloads.plex.tv/plex-media-server-new/1.20.2.3370-b1b651549/debian/plexmediaserver_1.20.2.3370-b1b651549_amd64.deb).

I used Xen Orchestra to access the GUI for the Plex VM to check for anything unusual. I disconnected and reconnected the network interface; no change. I went for broke and tried to download the .deb package manually through the browser, only to find that the page wouldn't resolve for <https://plex.tv>.

I checked on both my MacBook Pro and my Manjaro box, and both were able to resolve the site without an issue. I tried <https://bitwarden.com>, just because it was in my “top sites”; same issue. The Plex site is hosted on AWS, but running a traceroute on <https://downloads.plex.tv> shows it resolving to — you guessed it — a Cloudflare IP. It's very likely their whole infrastructure is on AWS, but they use Cloudflare CDN.

## How I Resolved It

At this point, I was nearly convinced there was something wrong with the VM. I looked for a recent snapshot and kicked myself because the last snapshot was two months ago (this VM has gotten so large that I can no longer create an incremental backup because of Xen Orchestra limitations; another story for another time). This is when I remembered that the only other change I made was the addition of the Cloudflare IPs to pfBlockerNG.

I logged back into pfSense and removed the Cloudflare IP list from pfBlockerNG, then updated it. I went back to the Plex VM and tried using the browser again; it's now working fine. I tried to download the .deb package again; it downloaded without an issue. I logged back into Plex to find that all the metadata was now there.

I realized that what I did was permit traffic outbound, but not inbound. Effectively, I blocked all Cloudflare IP ranges coming into my network. It didn't occur to me that anything was wrong because I was still able to access my sites hosted by Cloudflare since traffic was flowing outbound.

Problem solved? Not quite. I still wanted to get the Cloudflare IPs allowlisted on pfSense.

Because of an authentication issue I had a while back with getting Plex working on one of my restricted VLANs, I set up an alias to allow traffic from <https://plex.tv> to that particular VLAN. This has been tremendously helpful, so I figured I might get lucky with doing the same for the Cloudflare IPs.

I went into `Firewall > Aliases > URLs` and added the [Cloudflare IPs](https://www.cloudflare.com/ips-v4) site. I navigated to `Firewall > Rules` and created the following firewall rule:

- `Action`: Pass
- `Interface`: WAN
- `Source`: Single host or alias | Cloudflare alias
- `Destination`: LAN Net
- `Gateway`: WAN_DHCP

As of the time of this writing, it's only been about 6 hours since I made this change, so it may be too soon to tell. However, things have been stable, and I haven't received any notifications. I'll continue to monitor things and update if necessary, but hopefully, I won't have to.
