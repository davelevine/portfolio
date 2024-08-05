---
title: Google Photos / Rclone Issue
authors: [davelevine]
categories:
    - Knowledge
date: "2021-02-27"
description: Since my son was born, my wife and I have been taking what seems like an endless stream of photos and videos, all of which are backed up to Google Photos. This has been great as it's seamless and easy to distribute to family members. So what's the problem?
---

<!--markdownlint-disable-->

## Summary

Since my son was born, my wife and I have been taking what seems like an endless stream of photos and videos, all of which are backed up to Google Photos. This has been great as it's seamless and easy to distribute to family members. So what's the problem?

<!-- more -->

The problem amounts to my own paranoia. I have photos and videos that have become priceless to me. I'm not terribly concerned that Google will lose my data; they seem to know what they're doing. I'm more concerned with somehow losing access to my account. Although I go to great lengths to secure my account, I still firmly believe that I'd lose access to my account long before Google ever loses my data.

It basically amounts to having all your eggs in one basket, and amounts to having no recourse should disaster strike. This is where rclone comes in.

## Rclone

Rclone has been an unbelievably reliable tool for backing up my Google Photos account. It just works. I have a number of cron jobs setup that run when they're supposed to, and the whole setup has amounted to “set it and forget it”. So it really shocked me when I got a notification from healthchecks.io that backup jobs for my account started failing on 2/6/21.

## Workflow

Rclone has two jobs for my account — one to download all my photos/videos, and one to download all my albums. Both jobs handle the content the same, but having them separate keeps things way more organized.

For this post to make more sense, it's important to understand the workflow. Because of the priceless nature of these photos and videos, I back them up multiple times in multiple locations. The intervals are not relevant to this post. This amounts to the following:

* Rclone downloads everything to a Debian VM on my server every 12 hours for photos/videos and once a week for my albums.
* Rclone then backs up to two additional locations:
  * Daily backups to Synology NAS (local)
  * Weekly backups to Backblaze B2 (remote)
* Rclone runs a clean-up on B2 3x/month to allow for it to remove anything that's been deleted from the source and keep costs down.

## Job Failures

As I mentioned, the jobs for my photos/videos and albums started failing on 2/6/21. I really didn't think much of it since there have been instances where the photos haven't backed up at a certain time, but will get picked up during the next time the job runs. That wasn't happening this time around.

I have a log file on the Debian VM that rclone dumps verbose information in for all the jobs. I combed through the logs for each job and began seeing a ton of 403, 429 and 500 errors. This is concerning because I couldn't understand what would be causing it to fail over and over again.

I tried the following:

* Renew Google Photos API credentials
* Check the disk space and integrity
* Re-run the jobs with different parameters to ignore errors
* Download the skipped files one-by-one

Nothing worked to solve the issue.

I scoured the rclone forums and the Issues section of the rclone GitHub repo for answers as to what might be happening. Long story short, I came up largely empty, and anything similar that I could find seemed to all point to corruption on the source. I checked the source, and the videos played fine.

The log files seemed to point to 4 videos that were failing to upload on both jobs. This was due to the videos existing in both my photo bucket and a handful of albums. Looking at the filenames from the log file, I compared it to the photos taken on 2/6/21 on Google Photos. They all ended up pointing to videos that were taken with a slow-motion filter. This is not something I ever use, but watching my son in a sled having the time of his life deserved the slow-motion effect.

The problem is that this seems to stem from a limitation with the Google Photos API. Whether it's being handled by Google, I can't say.

## Resolution

What I ended up doing was downloading the videos directly from Google Photos, then copying them to the Debian VM. Since the problem stemmed from not being able to pull them from Google Photos via the API, I figured I'd do things manually.

After the videos were added to the Debian VM, I re-ran both jobs, which passed without any issues and reported their status to healthchecks.io.
