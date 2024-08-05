---
title: Homelab Overhaul
authors: [davelevine]
categories:
    - Recommended
date: "2021-08-07"
description: In the last few months, I've decided that I no longer have a use for quite an extensive homelab. I'll outline the reasons below, but this has prompted me to give considerable thought to replacing my current setup little-by-little.
---
<!--markdownlint-disable-->

## Preface

In the last few months, I've decided that I no longer have a use for quite an extensive homelab. I'll outline the reasons below, but this has prompted me to give considerable thought to replacing my current setup little-by-little.

I've decided that my [HP Z620] Workstation will be deprecated in favor of [Intel NUC (NUC10i7FNH1)]. I haven't decided what to do with the Z620, but it's still a workhorse and can either be repurposed or sold.

[HP Z620]: https://support.hp.com/us-en/document/c03270936
[Intel NUC (NUC10i7FNH1)]: https://www.intel.com/content/www/us/en/products/sku/188811/intel-nuc-10-performance-kit-nuc10i7fnh/specifications.html

<!-- more -->

## Need for Replacement

This is due to a few reasons...

- General downsizing due to lack of time to devote to maintaining a homelab
- Improper setup of XCP-NG
- Inability to upgrade XCP-NG due to unsupported hardware
- Overly complex
- Unable to resolve issue with broken RAID
  - Because of this, hypervisor is not installed on SSD, but rather on a WD Red data drive, which is incorrect.
  - SSD is not seen or recognized and the two WD Red drives function independently of one another.
  - When one drive dies, the entire setup will be lost.
- Backups are overly complex and cannot be easily migrated to another system.
- Hypervisor maintenance is difficult as it relies on one of two things...
  - Xen Orchestra
    - Cannot be used (as far as I'm aware) to perform any real maintenance on the system.
  - XCP-NG on Windows
    - This is impractical as the Windows VM lives on my Manjaro box by way of Virtualbox.

## Can the box be repurposed?

Of course. The box is great and does work well, but my need for space and an overall smaller homelab footprint has become more important. The box has simply become overkill for my needs.

## Path Forward

### Considerations

- Leave Z620 connected until NUC has been fully setup and tested.
- Configure NUC with Ubuntu Server to do away with hypervisor.

### Install

Install Docker and the following containers:

- Plex
- Tautulli
- Glances
- Portainer

### Migrate

- Migrate any crontabs from all VMs on Z620
  - Adjust file/folder paths as necessary and ensure they all work as they should.
  - `Make absolutely sure that all files/folders have the proper permissions to work, especially regarding the Google Photos backup`
- <s>Migrate Nagios XI to RasPi</s>
  - This <s>may not even be</s> is not necessary as Glances will <s>likely</s> cover what's necessary. <s>May need to take health notifications for disk, ram, etc into consideration.</s>
    - Edit: After looking into this further, will install Smartmontools from Ubuntu pkg repo and run it every month with a cronjob. Report to healthchecks.io.
      - Instructions to do this can be found [here](https://brismuth.com/scheduling-automated-storage-health-checks-d470b4283e3e)
  - <s>Reimage current RasPi that displays Nagios</s>

### Backups

- Make sure to configure regular backups to NAS
  - Can make use of Timeshift for command line. Instructions can be found [here](https://dev.to/rahedmir/how-to-use-timeshift-from-command-line-in-linux-1l9b)
  - Once backup is taken, use Rclone at some interval to send to NAS.
    - Once configured, setup a cronjob and report to healthchecks.io.

### Document

- Archive/retire any documentation for systems that will no longer be in use.
- Change overall documentation hierarchy accordingly to simplify navigation.
- Overhaul articles as needed.

## Next Steps

This is going to be a long process as I've spent a number of years implementing my current setup. The idea is to chip away at it a little at a time. The good news is that this is by far the most complex part of my homelab outside of the network itself. I have no desire to start tearing down the 4 VLANs anytime soon, but I'll get there in time.
