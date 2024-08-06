---
title: Databases (Part 1)
authors: [davelevine]
categories:
    - AWS
date: "2020.05.14"
description: I finished the database section of the AWS Solutions Architect Associate course a few days ago, and it was by far the most challenging to wrap my head around.
---

<!--markdownlint-disable-->

## Introduction

I finished the database section of the AWS Solutions Architect Associate course a few days ago, and it was by far the most challenging to wrap my head around.

Just to point it out for the record — I am by no means a database guy. I know what they are at a cursory level, but I have no real hands-on experience to speak of with any type of databases.

This will be my attempt to make sense of all the database offerings from AWS.

<!-- more -->

## SQL — Relational Database Service (RDS)

### Overview

RDS is one of the managed database offerings from AWS. It's SQL based, so it allows for you to spin up a number of the most popular SQL database engines such as:

* MySQL
* PostgreSQL
* Microsoft SQL Server
* Oracle Database
* MariaDB

Since RDS is a managed database, it takes over a lot of the management tasks of a relational database such as:

* Scaling
* Backups
* High availability (if configured)

Each database is referred to as an instance, and each instance runs a database engine. The database instance is the database environment that exists within the AWS cloud. The instance can be accessed and modified by making use of the AWS Command Line Interface, the Amazon RDS API, or the AWS Management Console.

The Orion Papers from Linux Academy have a number of diagrams that really outline this information well and can be seen below.

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//05/Screen-Shot-2020-05-13-at-11.43.07-PM.png" alt="Screen Shot 2020-05-13 at 11.43.07 PM" />
<br></br>
<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//05/Screen-Shot-2020-05-13-at-11.44.17-PM.png" alt="Screen Shot 2020-05-13 at 11.44.17 PM" />

### Limitations

There are a handful of constraints and quotas that are imposed on RDS. Instead of listing them all out, AWS has it [documented](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html) very well.

### Multi-AZ Deployment

One of the biggest benefits of using RDS is that it can be deployed using a number of Availability Zones (AZs). This provides an increased amount of availability and durability. When a database is deployed to multiple AZs, the data is synchronously replicated to a standby note in a different AZ.

Some additional benefits of [Multi-AZ architecture](https://aws.amazon.com/rds/features/multi-az/) are:

* Enhanced Durability
* Increased Availability
* Database Performance
* Automatic Failover

A diagram from the Orion Papers can be seen below to show this further.

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//05/Screen-Shot-2020-05-13-at-11.44.33-PM.png" alt="Screen Shot 2020-05-13 at 11.44.33 PM" />

## Read Replicas

Read replicas are something that I've seen before as an offering in my own environment, but didn't admittedly see the advantage of using at first. They allow for scaling the amount of reads to a database, and in the case of RDS, allow for up to 5x increase in reads. They can exist either in the same region or a different one and also support Multi-AZ architecture. The reads are done at an *eventually consistent* speed, which is normally seconds, so long as the application in question supports it.

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//05/Screen-Shot-2020-05-13-at-11.44.47-PM.png" alt="Screen Shot 2020-05-13 at 11.44.47 PM" />

## To be continued

I don't want this post to become unmanageable by writing in detail about all the AWS database offerings. To accomplish this, I'm going to split this post into a few parts so that it doesn't become overwhelming.

Part 2 can be found [here](../blog/databases-part-2).
