---
title: EC2 Volume Types
authors: [davelevine]
categories:
    - AWS
    - Knowledge
date: "2020.03.25"
description: A simple breakdown of the different types of storage options available for EC2 instances, helping to clarify when to use each one.
---

<!--markdownlint-disable-->

# Instance Store vs. Elastic Block Store

## Preface

Since I'm currently going through the [AWS Certified Solutions Architect course](https://linuxacademy.com/course/aws-certified-solutions-architect-2019-associate-level/) offered by [Linux Academy](https://linuxacademy.com), I'm going to need to write things out so that they make a bit more sense to me. Today, it's going to be the differences between Instance Stores and Elastic Block Stores.

<!-- more -->

### Instance Store

* Provides temporary block level storage for an EC2 instance.
* Ephemeral; best used to store data temporarily that frequently changes.
  * ex. buffers, cache or scratch data.
* Data will not survive if the instance is stopped, terminated or if the underlying drive just fails.

### Elastic Block Store

* Provides either SSD or traditional HDD backed volumes, depending on need, performance requirements and/or price.
  * SSD volumes:
    * Best for transactional workloads such as frequent read / write operations.
    * Two types of SSDs — General purposed (gp2) and Provisioned IOPS (io1).
      * General purpose favors balance of price and performance.
      * IOPS favors high performance (mission-critical low-latency / high-throughput)
  * HDD volumes:
    * Best for larger streaming workloads where throughput is more desirable than IOPS.
    * Two types of HDDs — Throughput optimized (st1) and Cold HDD (sc1).
      * Throughput optimized is better used towards hot storage where data is frequently accessed and throughput is essential.
      * Cold HDD is low cost storage designed for less frequently accessed workloads such as archiving.

I'm not going to get into IOPS or I/O credit balances since I think those topics require their own page(s). This should serve as a great reference since my understanding after watching the video was still a bit hazy.

Next up — EBS Snapshots

### References

[Instance Store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html)

[Elastic Block Store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html)
