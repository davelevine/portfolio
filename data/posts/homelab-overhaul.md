---
title: Homelab Overhaul
authors: [davelevine]
categories:
    - Recommended
date: "2021.08.07"
# Start of Selection
description: I've decided to downsize my extensive homelab setup and my reasons are outlined below.
# End of Selection
---
<!--markdownlint-disable-->

## Preface

In the last few months, I've decided that I no longer have a use for quite an extensive homelab. I'll outline the reasons below, but this has prompted me to give considerable thought to replacing my current setup little by little.

I've decided that my [HP Z620] Workstation will be deprecated in favor of an [Intel NUC (NUC10i7FNH1)]. I haven't decided what to do with the Z620, but it's still a workhorse and can either be repurposed or sold.

[HP Z620]: https://support.hp.com/us-en/document/c03270936
[Intel NUC (NUC10i7FNH1)]: https://www.intel.com/content/www/us/en/products/sku/188811/intel-nuc-10-performance-kit-nuc10i7fnh/specifications.html

<!-- more -->

## Need for Replacement

This decision is due to a few reasons:

- General downsizing due to lack of time to devote to maintaining a homelab.
- Improper setup of XCP-NG.
- Inability to upgrade XCP-NG due to unsupported hardware.
- Overly complex setup.
- Unable to resolve an issue with broken RAID:
  - Because of this, the hypervisor is not installed on an SSD, but rather on a WD Red data drive, which is incorrect.
  - The SSD is not seen or recognized, and the two WD Red drives function independently of one another.
  - When one drive fails, the entire setup will be lost.
- Backups are overly complex and cannot be easily migrated to another system.
- Hypervisor maintenance is difficult as it relies on one of two things:
  - Xen Orchestra:
    - Cannot be used (as far as I'm aware) to perform any real maintenance on the system.
  - XCP-NG on Windows:
    - This is impractical as the Windows VM lives on my Manjaro box via VirtualBox.

## Can the Box be Repurposed?

Of course. The box is great and works well, but my need for space and an overall smaller homelab footprint has become more important. The box has simply become overkill for my needs.

## Path Forward

### Considerations

- Leave the Z620 connected until the NUC has been fully set up and tested.
- Configure the NUC with Ubuntu Server to eliminate the need for a hypervisor.

### Install

Install Docker and the following containers:

- Plex
- Tautulli
- Glances
- Portainer

### Migrate

- Migrate any crontabs from all VMs on the Z620:
  - Adjust file/folder paths as necessary and ensure they all work as they should.
  - Make absolutely sure that all files/folders have the proper permissions to work, especially regarding the Google Photos backup.
- <s>Migrate Nagios XI to Raspberry Pi</s>
  - This <s>may not even be</s> is not necessary as Glances will <s>likely</s> cover what's needed. <s>May need to take health notifications for disk, RAM, etc. into consideration.</s>
    - Edit: After looking into this further, I will install Smartmontools from the Ubuntu package repository and run it every month with a cron job. Reports will be sent to healthchecks.io.
      - Instructions to do this can be found [here](https://brismuth.com/scheduling-automated-storage-health-checks-d470b4283e3e)
  - <s>Reimage the current Raspberry Pi that displays Nagios</s>

### Backups

- Make sure to configure regular backups to NAS:
  - Can make use of Timeshift for command line. Instructions can be found [here](https://dev.to/rahedmir/how-to-use-timeshift-from-command-line-in-linux-1l9b)
  - Once a backup is taken, use Rclone at some interval to send it to the NAS.
    - Once configured, set up a cron job and report to healthchecks.io.

### Document

- Archive/retire any documentation for systems that will no longer be in use.
- Change the overall documentation hierarchy accordingly to simplify navigation.
- Overhaul articles as needed.

## Next Steps

This is going to be a long process as I've spent a number of years implementing my current setup. The idea is to chip away at it a little at a time. The good news is that this is by far the most complex part of my homelab outside of the network itself. I have no desire to start tearing down the 4 VLANs anytime soon, but I'll get there in time.
