---
title: Plausible Analytics
authors: [davelevine]
categories:
    - Knowledge
    - Recommended
    - Tools
date: "2021.03.20"
description: A personal exploration of self-hosted analytics solutions and their implications on privacy.
---


## Scratching an Itch

Analytics has been something that I've had mixed feelings about for as long as I've been aware of them. I understand the obvious benefits that come from having them in place. I also understand the privacy implications that come from having them in place. For me personally, I generally block as much analytics and telemetry as I can.

However, because I see the appeal in having them, I wanted to setup my own to understand them a bit better. I figured that if I setup my own on my own personal sites, it would give me a better idea of how they work. The sites I run are all visited by me, except my portfolio, which is public (not sure how much traffic that one is currently getting, but I'll find out now).

<!-- more -->

## Finding a Solution

Right off the bat, I knew I didn't want to use Google Analytics. I've looked at the interface before, and although I know it's basically the gold standard for analytics, I still didn't want to use it simply because of the way Google operates.

After looking into what's out there, I narrowed it down to the following services:

* Fathom
* Matomo
* Plausible
* Umami

Each of these had their own appeal, and I'll go through what ultimately caused me to go with Plausible.

### Fathom

I had given Fathom a try probably a year ago, but I didn't have any sites to add to it at the time. What I didn't realize at the time, but realized this go-around was that Fathom has deprecated their self-hosted option, so it's ultimately a very stripped down version of their hosted option.

When looking at the other alternatives and the amount of work to get Fathom setup, I knew I could do better.

### Matomo

Matomo literally bills itself as “Google Analytics alternative that protects your data and your customers' privacy”. On it's face, this is a pretty good draw. If you're looking for a slightly less complicated solution than Google Analytics, but still want a slick interface and the increased privacy, it's a great solution.

Since I run nearly all my self-hosted apps in Docker containers, this would be no exception. The problem was that for some reason, I couldn't figure out how to get it running with an external MySQL database. It's possible I just didn't stick with it long enough, but frankly, I don't want to spend hours on a service to get it to work, especially one like this that's purely just satisfying my own curiosity.

### Plausible

When I first saw Plausible and how simple and slick it looked, I was pretty sure this is what I was going to stick with. I figured it was worth starting a free trial on their site to see if I really liked it as much as I thought I would. Simply put, I was not disappointed.

The interface was slick and super easy to get started. It's nice that it only has a very lightweight single snippet of tracking code. I added it to my portfolio, and it registered on the site with ease. At this point, I knew I found what I was looking for, but I wanted to try and self-host it because I really don't think this is something I need to pay for.

The one thing that almost turned me off from pursuing this is that it requires a Postgres database to run, along with a Clickhouse big data server to register events. I have nothing against either of these, but having a managed MySQL database, I wanted to leverage it if possible. I looked around to see if it's possible, but it isn't. If I was using this in a Production environment, I'd want a managed Postgres database since I have no experience with using Postgres. For my needs though, I went through the motions with installing a Postgres database in a Docker container.

After adding everything to my Docker Compose file, I ran it and launched the Plausible stack. It took a little tweaking, but I got it up and running with no issues. I added my portfolio to it as a test, and it came up just as easily as the hosted Plausible did.

The only thing I haven't gotten working, which frankly isn't that big of a deal is the geolocation. This would be neat, but after spending longer than I should've on this, I just cannot figure out why it isn't working. Not a dealbreaker, but something that would be necessary to get working in a Production environment.

### Umami

Umami might be the slickest of the bunch, and it runs on MySQL, so I figured it would be a no-brainer to get it working. Long story short, this was not the case. I'm fairly sure after having issues with Matomo that it's me, but I once again could not get it running with a Docker container and an external MySQL database.

I really thought that this was going to be the one I ended up with, but to say it again, I don't want to spend hours working on a service just to get it to work. I may go back to it some day to try again, but for now, I'm content without it.

## Lessons Learned

Ultimately, I decided on Plausible because with a bit of work, it accomplished what I set out to do. I learned a bit about analytics and have a slick setup to show for it. As stated, I may give Umami a try some day because of how slick it is, but I'll stick with what I have for now.
