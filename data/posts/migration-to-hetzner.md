---
title: DigitalOcean to Hetzner Migration
categories:
    - Cloud
    - Recommended
date: "2023.06.08T17:31Z"
description: I've been happy with DigitalOcean as my VPS provider since 2019, but their recent price increases have become too much for me.
---

## Background

I've been using [DigitalOcean](https://www.digitalocean.com) as my cloud provider of choice for VPS since late 2019, and overall, I've been very happy with them. While I can't say a bad thing about them as the service has been rock solid, as of late, they've gotten much too [expensive](https://www.fool.com/investing/2022/05/16/digitalocean-first-price-increase-20-percent/) for me.

This has been unfortunate as I really like DigitalOcean, but I can no longer justify the cost of continuing with them, especially for what I'm getting in return. As of this writing, I'm paying for a basic shared CPU instance with 2 vCPUs, 2GB of memory, and a 50GB hard drive, for $18/month.

Admittedly, the large majority of DigitalOcean's competitors also have similar offerings, which is a real bummer because the cost difference hasn't been enough for me to seriously consider migrating away from DigitalOcean.

This changed as I was looking around on Reddit a few days ago and someone suggested [Hetzner Cloud](https://www.hetzner.com/cloud). I've looked into Hetzner on a few occasions in the past, but there were a few reasons I didn't really consider them:

* They largely deal in dedicated server hosting and server auctions, so they didn't really have a 1:1 offering.
* They didn't have any data centers in the US.

I'm not exactly sure when they launched their VPS offering, but they began opening US data centers in 2021. Little did I know how big of a difference the offerings from Hetzner are compared to DigitalOcean.

## Comparison

In order to really understand the difference in pricing, the following pricing grids really tell the story:

### DigitalOcean Pricing

![DigitalOcean Pricing](https://cdn.levine.io/uploads/images/gallery/2023-06/do-pricing.png)

### Hetzner Pricing

![Hetzner Pricing](https://cdn.levine.io/uploads/images/gallery/2023-06/hetzner-pricing.png)

After seeing the sheer difference in value that Hetzner brings for the price, it was exactly the sort of push I needed to finally migrate away from DigitalOcean.

## Migration

As I had been weighing this decision for some time, I already had a bit of an idea of how I'd go about doing this migration. DigitalOcean doesn't really make it easy to migrate away from them as they don't offer a way for you to obtain a backup or snapshot of your VPS.

To get around this, I was planning on following the steps in this [guide](https://vpsranked.com/quickly-migrate-vps-servers-between-digitalocean-vultr-and-lunanode/) to get me on the right track. The article boils down to a few tasks:

* Add a block storage volume to the VPS
* Copy the disk to an image file
* Use SimpleHTTPServer to launch a webserver for downloading the image file
* Upload the image to Hetzner and create a VPS from it

This all would've worked just fine but the more I thought about it, the more a 'lift and shift' didn't sit well with me. I've had this VPS since 2019, and since then I've done who knows how much to it. While it's very much in working order, there's so many lingering files and folders on it from past projects that I made the decision to start fresh and migrate the files and configurations I still needed accordingly. Since my VPS on DigitalOcean primarily utilized Docker Compose, the migration wouldn't be too challenging.

## Steps Taken

After creating the server on Hetzner, I used the console to obtain shell access. I created a new user so I wouldn't need to make use of the root user. After that, I granted it sudo privileges, created the home directory, and then once I tested the assigned privileges, I disabled login on the root account.

One of the conveniences of installing the server on Hetzner is that they have a particular build that comes with Docker already installed. I took advantage of it and it saved me a few steps. I still needed to add my new user to the Docker group so the `docker` command could be run without `sudo`, but otherwise, it was all frontloaded for me.

## Docker Compose

At this point, I was ready to begin migrating my apps. Since 99% of what I was using on DigitalOcean was installed via Docker Compose, it was a breeze to get everything installed again. I had to make some minor adjustments to my `docker-compose.yml` file to ensure it was up to date.

After running `docker-compose up -d`, everything was installed successfully. There were a few things that needed to be done though:

* Copy over configuration files from DigitalOcean
* Migrate the SQLite database for *Overseerr*
* Migrate dotfiles
* Migrate cronjobs (crontab)

## Configuration

Since there were only a few configuration files and one crontab to migrate, I decided that I'd just create them manually as it would've been more work to set up a way to shuttle them over.

After creating the configuration files, I restarted the respective containers and confirmed all apps were now running with the appropriate configurations. The `crontab` was just a simple cut/paste. The next thing to do, which I had no choice but to find a way to migrate it was to migrate the SQLite database.

I decided to leverage *rclone* to shuttle the SQLite database to [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html). This would make it easy to get it off the server on DigitalOcean and allow me to either use `wget` or `curl` to download it.

After setting up the Backblaze integration in rclone, I sent it to B2 and downloaded it with `wget`. I made sure to also download the associated `settings.json` file to ensure all user settings made it as well.

Once completed, I restarted the *Overseerr* container and I was back in business.

## Wrapping Up

At this point, I was able to shut down the DigitalOcean server. I couldn't delete it yet since I needed to wait for confirmation that all my cronjobs were going to run as planned. I gave it a day and found that one hadn't run. This was a false positive though because it was a job for backing up my Unifi controller to B2, but the controller itself hadn't yet made any backups so there was nothing to do.

For good measure, I gave it 3 more days to confirm I didn't need anything from it and also that nothing unexpected happened. Earlier today, I took my final snapshot for the server and deleted it. As I tend to do, I'll keep the snapshot for the next 6 months, give or take, before deleting it.

## Lessons Learned

During the process of migrating this server, there were a few things that I learned that I think are worth noting.

I'd never migrated a SQLite database before, which I thought was kind of comical since I've worked with a number of apps that have relied on SQLite databases. It ended up being a breeze, which was nice because I was sweating this migration more than anything.

Another thing is that I should've done this a lot sooner than I did. I kept putting it off largely because I didn't think I'd have the time to do it. After finally taking stock of what I had to actually do, I found that it wouldn't actually take much time at all. It ended up costing me quite a bit of money each month that wasn't necessary.

Finally, it's worth noting that I'm glad I did this migration. I was largely happy with DigitalOcean over the years which is why I never gave any serious thought to leaving. The reality is that the large majority of major cloud providers have similar levels of reliability so there's little risk in moving from one to the next. I still think DigitalOcean is awesome and wouldn't hesitate to recommend them, but for the time being, they aren't a good fit anymore.

Here's hoping that Hetzner will be a good fit for years to come.
