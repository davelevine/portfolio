---
title: Running Charm.li in Docker Compose
categories:
    - Knowledge
    - Tools
date: "2025-05-14T11:14:00Z"
description: This post explains how to run Charm.li in Docker Compose on Ubuntu Server 24.04.02 LTS.
---

## Summary

Over the last few days, I've been working on seting up a new computer for my dad. As he's a mechanic, one of the things he'll be using it for is to lookup information on different makes and models of cars and trucks. He's been using [Alldata](https://alldata.com) for some time now, but I tipped him off to [charm.li](https://charm.li) and he was interested.

Now, I could've just gave him the url and stopped here, but since the [data](https://charm.li/operation-charm.torrent) itsself has kindly been provided by the creator of the site, I wanted to see if I could self host it. While looking into how I could make this work, I came across a [thread in r/mechanic](https://www.reddit.com/r/mechanic/comments/1iq0qjh/operation_charmli_is_down_but_not_lost/) about the site recently being down for an extended period. These things happen, but with the ability to obtain the data, I figured I'd take a shot at running this myself.

I currently have my version hosted at [https://manuals.haroldsauto.com/](https://manuals.haroldsauto.com/).

## What We're Working With

Before diving into the technical setup, I'm doing all of this on Ubuntu Server 24 LTS. This will work on other distributions, but may need to be adapted accordingly. With this in mind, let's understand what we're dealing with:

[charm.li](https://charm.li) is built on Node.js that serves content from a Lightning Memory-Mapped Database (LMDB). The database itself is packaged in a squashfs file - a compressed, read-only file system that's commonly used in Linux distributions.

There are essentially three components needed to make this work properly:

- The Node.js application code
- The mounted squashfs file containing the LMDB database
- Network access to serve content to browsers

While there aren't any official setup instructions that I'm aware of, someone took a crack at this and added it to [GitHub](https://github.com/rOzzy1987/charm.li). The instructions are fairly straightforward:

```text
1. Create directory: mkdir ./lmdb-pages
2. Mount squashfs: (as root) mount -o loop -t squashfs ./lmdb-pages.sqsh ./lmdb-pages
3. Install Node.js dependencies: npm install
4. Start server: npm start / 8080 to start on http://localhost:8080
```

However, making this run in Docker and persistent across reboots requires additional effort.

## The Challenge

One thing to understand before attempting this is the challenge of obtaining the data. In total, it's slightly over 700GB, which can be prohibitive without a dedicated storage medium to host it. For my needs, I'm hosting it on my NAS, so some things going forwrard will need to be adapted accordingly to your own environment should you decide to proceed.

I posted the link earlier in the thread, but in case it was missed, here it is again - https://charm.li/operation-charm.torrent

## Understanding the Directory Structure

As I mentioned before, my setup involves hosting the data on my NAS with the charm.li files stored at `/mnt/backup/operation-charm`. Adjust the paths accordingly to match your setup. Setting up this mount is outside the scope of this article, but here is my `/etc/fstab` entry for reference:

```bash
# NAS Directory Mount
192.168.1.6:/volume1/Files/     /mnt/Backup     nfs auto,noatime,nolock,bg,nfsvers=4,intr,tcp,actimeo=1800 0 0
```

First, we need to ensure the squashfs file gets properly mounted:

```bash
# Create the mount point if it doesn't exist
sudo mkdir -p /mnt/backup/operation-charm/lmdb-pages

# Mount the squashfs file
sudo mount -o loop -t squashfs /mnt/backup/operation-charm/lmdb-pages.sqsh /mnt/backup/operation-charm/lmdb-pages
```

This mounts the compressed data, but it's important to note that this mount won't survive a system restart. We'll get into this later.

## Creating the Docker Configuration

THe GitHub post I referenced earlier seems to get this going with Node.js version 18, which has now officially reached [end of life](https://endoflife.date/nodejs). Initially, when I first got this working, I ran it with Node.js 18 and it worked fine, but it doesn't make sense to do this now as there are much newer LTS versions available.

I decided to use Node.js 22, which is an LTS version supported until April 2027. Assuming you already have a `docker-compose.yml` file (create one if you don't), add the following to it:

```YAML
version: '3'

services:
  charm-li:
    image: node:22
    container_name: charm-li
    working_dir: /app
    command: >
      sh -c "npm install &&
      sed -i 's/127.0.0.1/0.0.0.0/g' server.js &&
      npm start / 8080"
    ports:
      - "28080:8080"
    volumes:
      - /mnt/backup/operation-charm:/app
    restart: unless-stopped
```

This configuration does several important things:

- Modifies the `server.js` file to listen on all interfaces (0.0.0.0) instead of just localhost.
- Uses port 28080 to prevent conflicts (feel free to change this if needed).
- Mounts the charm.li data into the container.
- Ensures the container restarts automatically if it crashes or after system reboots.

## Making the Mount Persistent

As I had mentioned earlier, if you simply mount the squashfs file and reboot, your mount disappears, and charm.li stops working. There are a few different ways you can make this survive a reboot, but what I ended up doing was creating a systemd service that ensures the mount persists:

```bash
# Create a systemd service file
sudo nano /etc/systemd/system/mount-charm.service
```

Add this service definition:

```text
[Unit]
Description=Mount charm.li squashfs file
After=network.target remote-fs.target
RequiresMountsFor=/mnt/Backup

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/bin/bash -c 'if ! mountpoint -q /mnt/Backup/operation-charm/lmdb-pages; then mount -o loop -t squashfs /mnt/Backup/operation-charm/lmdb-pages.sqsh /mnt/Backup/operation-charm/lmdb-pages; fi'
ExecStop=/bin/bash -c 'if mountpoint -q /mnt/Backup/operation-charm/lmdb-pages; then umount /mnt/Backup/operation-charm/lmdb-pages; fi'

[Install]
WantedBy=multi-user.target
```

There's a lot going on here, so let me explain it a bit:

- It only attempts to mount if the directory isn't already mounted.
- It waits for network and remote filesystems to be available first.
- It automatically unmounts during shutdown.
- It uses the "oneshot" type with `RemainAfterExit`, which works well for mount operations.

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable mount-charm.service
sudo systemctl start mount-charm.service
```

## Launch Charm.li in Docker

With the persistent mount ready to go, start the Docker container:

```bash
cd /path/to/docker-compose.yml
docker-compose up -d
```

After a moment, charm.li will be available at http://your-server-ip:28080.

## Cloudflare Tunnel

While the setup described above works great for local network access, I wanted to make this available from anywhere without opening ports on my home network to accomplish it. Cloudflare Tunnel provides an elegant solution to this problem.

Setting up Cloudflare Tunnel is well outside the scope of this article, but if this is of interest to you, the following is a really great guide to getting it going:

[https://medium.com/design-bootcamp/how-to-setup-a-cloudflare-tunnel-and-expose-your-local-service-or-application-497f9cead2d3](https://medium.com/design-bootcamp/how-to-setup-a-cloudflare-tunnel-and-expose-your-local-service-or-application-497f9cead2d3)

## Overcoming Node.js Challenges

I think it's worth mentioning that during my testing, I discovered that Node.js version compatibility can be tricky. charm.li relies on `node-lmdb`, a native module that needs to be compiled specifically for your Node.js version.

While I originally tested Node.js 18 and got it to work reliably, I needed to use the newer Node.js 20. However, when changing the version number and rebuilding the container, I encountered this error:

```Text
Error: The module '/app/node_modules/node-lmdb/build/Release/node-lmdb.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 108. This version of Node.js requires
NODE_MODULE_VERSION 127.
```

To solve this, you need to rebuild the native modules. This can be done with a temporary modification to the 'command' in the docker-compose file:

```YAML
command: >
  sh -c "apt-get update && apt-get install -y python3 make g++ && 
  npm install &&
  npm rebuild node-lmdb &&
  sed -i 's/127.0.0.1/0.0.0.0/g' server.js &&
  npm start / 8080"
```

This adds the necessary build tools and rebuilds `node-lmdb` for your specific Node.js version. Once it's rebuilt and working, revert to the earlier command:

```YAML
command: >
  sh -c "npm install &&
  sed -i 's/127.0.0.1/0.0.0.0/g' server.js &&
  npm start / 8080"
```

This can be reliably used when upgrading to a new Node.js version.

## Why This Approach Works

While this is by no means the only way to get this going, I found this approach has several advantages:

- Clean separation of concerns: The host system handles the `squashfs` mounting (where it's most reliable), while Docker handles the application runtime.
- Persistence across reboots: The `systemd` service ensures the mount remains available even after system restarts.
- Portability: This approach works across different Linux distributions with minimal modifications.
- Security: We avoid running the Docker container with elevated privileges for mounting.

## Conclusion

This was a quick and dirty afternoon project, and I learned a lot in doing it. Running it in Docker Compose seemed like a complex task at first glance, but breaking it down into manageable steps made it accessible.

What started as a simple idea to help my dad access repair manuals grew into an interesting challenge. Probably the most valuable takeaway from this project is how to handle applications with specialized storage requirements in Docker. While Docker genereally leans toward complete isolation, there are legitimate cases where the host system needs to handle certain tasks (like mounting specialized filesystems) while the container focuses on application execution.

If you're considering implementing this for yourself, remember that the ~700GB data requirement is substantial, but the payoff is worth it for anyone who regularly needs access to automotive repair information. The setup process takes time, but the result is robust and requires minimal maintenance once configured.
