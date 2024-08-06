---
title: DigitalOcean Migration
authors: [davelevine]
categories:
    - Knowledge
date: "2020.08.30"
description: As much as I enjoy using AWS, to use it how I would like to use it is just too expensive.
---

<!--markdownlint-disable-->

## Background

As much as I enjoy using AWS, to use it how I would like to use it is just too expensive. Because of this, I've hosted the large majority of my cloud infrastructure on DigitalOcean. This boils down to two reasons — it's a lot easier to use than AWS, and the pricing is predictable.

<!-- more -->

Could I estimate how much it would cost for me to host everything on AWS? Sure, and here's the breakdown...

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//08/Screen-Shot-2020-08-29-at-11.46.13-PM.png" alt="Screen Shot 2020-08-29 at 11.46.13 PM" />

Of course, this is based off a quick estimate that doesn't really account for actual usage, including snapshots and data transfer. The thing is, regardless of all that, nearly $50/month is a lot. Factor in something like data transfer, and it could end up being a lot more. The same configuration on DigitalOcean works out to be a lot cheaper.

This is my bill as of the moment. This will end up being even cheaper next month since I decommissioned two droplets this month and also disabled backups in favor of snapshots.

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//08/Screen-Shot-2020-08-29-at-11.52.09-PM.png" alt="Screen Shot 2020-08-29 at 11.52.09 PM" />

It may not seem like that big of a difference, but at ~$11-12/mo, that's pretty big to me. Anyway, let me not get too lost in the weeds with pricing and get back to the point of this article.

## Reasoning

I've been using DigitalOcean now for close to a year, and they've been rock solid. The entire reason I migrated to DigitalOcean to begin with is because I was initially self-hosting everything I use in my homelab.

While this is all well and good, my knowledge base also lived in my homelab. Although I'm pretty confident in my abilities with disaster recovery and managing everything, I'm by no means a database guy.

For my knowledge base, I use [Bookstack](https://bookstackapp.com), which is just fantastic. It uses a MySQL database, which is fine, although the more content I wrote, the more I worried about data corruption from something stupid like a power outage. Also, as confident as I am in my backups, I'm guilty of not testing them out as often as I should.

## Some History

I decided to spin up a $5 droplet on DigitalOcean and import my knowledge base into it. I installed Bookstack and cobbled together a MySQL dump of my entire Bookstack database. I was able to import the database into the newly created droplet, and after verifying all the content was still in one piece, I was feeling pretty good.

This lasted for a few months before I started thinking about what would happen if my droplet ever got hosed for some reason. All I really did was move my knowledge base from a locally hosted VM to a cloud hosted VM.

Enter the [Managed Databases](https://www.digitalocean.com/products/managed-databases/) from DigitalOcean.

Now, these are a little expensive, especially coming from just a single $5/mo droplet, so I figured I would create a cluster, create a MySQL dump of my knowledge base and import it into the managed cluster. If I didn't like it, I could just move back to the single droplet.

What a game changer!

I did a real deep dive into DigitalOcean's offering and realized what I was really getting for that additional money. In short, peace of mind.

I only have a single cluster without a standby node or a read replica, but that's honestly not needed for my use case. Because the database allows for point-in-time recovery and takes daily backups, should the underlying database ever get hosed, the node would automatically be re-provisioned with a backup close enough to the point of failure. Of course, this would have some downtime, but that's hardly a concern considering I'm the only one using it.

I created the managed cluster in January, and I've never looked back.

## Migration

In addition to hosting my knowledge base, I ended up hosting this blog, as well as my Unifi controller. This blog also utilizes the managed database, making the investment even more worthwhile.

Because I'm always thinking whether an app will interfere with another, I ended up running each in separate $5 VMs. This went on for a few months until I realized that there's a better way.

I decided to scrap my Unifi controller VM as it was and re-purpose it to utilize Docker instead. Everything I was hosting separately in multiple VMs could be run inside of containers. This also utilized a lot less space.

First I uninstalled my Unifi controller and installed the container version of it. I restored from my last backup, and I was up and running again like nothing ever happened. I was barely utilizing any CPU and memory as well with this setup, so I decided to migrate this blog next.

The blog was almost as seamless, but did take some extra configuring to connect it to the managed database, along with updating the IP information with Cloudflare. Once connected, I verified everything was still in one piece, took a final snapshot of the droplet (just in case) and destroyed it.

Finally, it was time for my knowledge base. I spun up a container of Bookstack, pointed it towards the managed database, updated the IP information with Cloudflare. I navigated to the URL and there it was.

`Some background` — my knowledge base has grown very large, currently sitting at the following stats:

* 218 pages
* 66 chapters
* 18 books
* 3 shelves

Because of the sheer amount of content I was sitting on, I decided to snapshot the droplet and power it down. I hung onto it for a week while I went through literally every single page, chapter, book and shelf to verify nothing was missing.

Everything was there, so I took a final snapshot and destroyed the droplet.

This led to another configuration change. The managed database does not host any images, but rather, those sit on the droplet. I've seen enough horror stories in articles and on Reddit to know that VM storage should generally be considered ephemeral.

I backed up the images to B2 using Rclone, although since Backblaze is on the west coast, the latency really slowed things down when trying to load the images. Because of this, I decided to make use of S3.

I created a bucket and configured it so that it would use S3 Standard, but included a lifecycle rule that content not used for 30 days would transfer automatically to S3 Infrequent Access. No point in paying more for content that isn't being used all the time, but can still be accessed at a moment's notice. Bookstack allowed this integration seamlessly, so now everything is backed up.

## Current State

At this point, the droplet was beginning to show signs of slowing down, so I needed to resize it. I started small and kept the single CPU, but bumped the memory to 2GB. It seemed fine at first, but any real usage started showing it wasn't enough. I played around with a few different configurations until finally settling on my current one...

* 2vCPUs
* 4GB of RAM
* 80GB SSD

I should also mention I installed a number of miscellaneous apps that I was hosting on my homelab. The decision to migrate them had more to do with their value than anything else. If I had something catastrophic happen to my homelab, I'd like to know those are safe.

I currently have three cron jobs running daily and weekly to backup everything to B2. This ensures complete peace of mind in my setup. Anything in my homelab is nearly 'take it or leave it', and my cloud environment can be restored with a single Docker compose file, and a handful of rclone commands. Because I'm so neurotic, I ever wrote a [knowledge article](https://knowledge.davelevine.io/books/digitalocean/page/how-to-restore-digitalocean-environment) on it.

I know that sounds almost silly because, what if everything is lost? Well, I also copy every article I write into Confluence, which is hosted by Atlassian. That way, I have complete redundancy of my knowledge base, so if disaster should strike, I'll be ready for it.
