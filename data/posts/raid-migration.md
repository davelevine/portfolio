---
title: RAID Migration
categories:
    - Cloud
    - Knowledge
date: "2020-06-07T17:21:00Z"
description: Rethinking my NAS RAID configuration to optimize storage while maintaining reliability.
---


## Analysis

Of all the systems I maintain in my homelab, the one I generally look at the least is my NAS. I'm not sure if that would come as a surprise to anyone, but it's become one of my most trusted “set it and forget it” systems.

This has been great for me because the less I have to think about, the better, especially when it comes to systems. The problem lately is that although everything is working as well as it should, I've been getting email notifications from it lately that it's beginning to run low on space.

Of course, running low on space is subjective — it still has north of 2TB remaining out of 16TB in total. This all has to do with my RAID configuration, and has made me rethink my configuration a bit to give me a bit more breathing room.

## Breakdown

My NAS backup architecture is fairly simple, but I suppose a bit more complex than average. The diagram below lists my backup architecture in broad strokes, but gives a good idea of what backs up to where.

![Backup Diagram](https://cdn.levine.io/uploads/images/gallery/2022-09//06/Backup_Diagram.png)

As can be seen from this diagram, all machines in one way or another all backup to my NAS. I'll break it down in broad strokes.

* `XCP-NG`: All VMs, configs and metadata
* `Dave's Computers`:
  * `Manjaro`: Timeshift snapshots and data
  * `MBP`: Snapshots
* `Maria's Computers`:
  * `Win7`: N/A
  * `MBP`: Time Machine backups

Of course, this is an oversimplification of it, but for the purpose of this post, further breakdown is unnecessary.

Additionally, my NAS information...

* Synology DS918+
* SHR-2 — Two disk fault tolerance
* 32TB Raw / 16TB usable

Obviously, just from looking at that amount of wasted space, I can do better.

## RAID Reconfiguration

I can't speak for other NAS systems like QNAP or UnRAID, but Synology really sucks in regard to changing RAID types. Most RAID types can be changed to some degree, but when you get locked into Synology Hybrid RAID 2 (SHR-2), you need to have an understanding of its pros and cons.

`Pros`:

* Reliable
* Mirrors data across all disks
* Two disk fault tolerance
* Essentially RAID 6

`Cons`:

* Changing RAID types requires the creation of a new volume
* Wasted space

When I originally set this up, I wasn't using much cloud storage at the time as it was a lot more expensive than it is now. Therefore, my priority at the time was being able to tolerate disk failure. The idea of being able to survive two out of four disks failing was too appealing. I also didn't think I would come anywhere near filling up 16TB!

Now, as my entire setup has changed dramatically since the creation of this RAID array, it's time to rethink things.

## Achieving a Balance

Although a lot of the data passing through my NAS eventually makes its way to the cloud, I don't particularly like having to retrieve data from the cloud unless I have to. I'd much rather retrieve it from my NAS since it's on premises and is its reason for existing in the first place. Therefore, I still need to maintain a balance of fault tolerance and maximizing available storage capacity.

I reviewed a lot of information on different types of RAID. I've run a few different ones in the past — RAID 1, RAID 6 & RAID 10 — but I wanted something different this time around.

The [Synology RAID calculator](https://www.synology.com/en-global/support/RAID_calculator) was a huge help in figuring out how exactly to best achieve what I'm looking for. The conclusion is to use RAID 5. It has exactly what I want — one disk fault tolerance, maximizes space, no loss in performance, etc.

Not that I know what I want, how do I go about doing it?

## Breaking New Ground

Converting away from SHR-2 is something I've wondered about for awhile now on and off. This is mostly because I'll need to get rid of the existing volume and migrate everything to a new volume, all while maintaining uptime and now losing data in the process. I thought it out and came to the following conclusion of how to make it happen:

* Break the existing RAID by removing and reinserting one drive.
* Create a new basic volume on this drive.
* Break the RAID further by removing and reinserting another drive.
* Create a new RAID configuration using these two drives and the basic volume.
* Migrate shared folders from the old volume to the new volume.
* Once all data has been migrated to the new volume, delete the old volume.
* Create a new RAID configuration with these two drives.

## Outcome

I put this into play this weekend, and it has been relatively smooth. The biggest drawback is by far the amount of time it takes to rebuild the RAID array. As of the time of this writing, the array has been building for around 48 hours and is only ~50% complete.

Once the array finishes rebuilding, my NAS will have 24TB raw usable storage with one drive being reserved for parity. Gaining an additional 8TB of storage space will definitely hold me over for years (it has to, since double-digit TB storage still isn't that cheap).

Overall, this has been a good experience, but my takeaway is that I really need to carefully consider the convenience I'm trading for added reliability. In this case, although it served me well, I'm not sure if it was the best decision. Of course, this is looking at it in hindsight. With fresh eyes, I believe this new configuration will serve me even better going forward.
