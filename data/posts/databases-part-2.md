---
title: Databases (Part 2)
authors: [davelevine]
categories:
    - AWS
date: "2020-05-15"
description: This will be a continuation in the Database series covering the AWS offerings as part of the AWS Solutions Architect Associate exam. I covered RDS in part 1 and will continue with Aurora in this part.
---

This will be a continuation in the Database series covering the AWS offerings as part of the AWS Solutions Architect: Associate exam. I covered RDS in [part 1](../posts/databases-part-1.md) and will continue with Aurora in this part.

<!-- more -->

## Aurora

Aurora is a relational database offering from AWS that is designed to be an improvement over RDS. It's a fully managed SQL database service, but is up to five times faster than MySQL and up to three times faster than PostgreSQL. It's built for speed, reliability and is offered at 1/10th the cost of commercial databases at the time of this writing.

### Clusters

Aurora is architected differently than RDS is. Aurora has a base configuration of a cluster instead of just one primary node and one or more standby nodes. The cluster contains a primary instance and zero or more replicas.

The cluster storage is configured so that all instances share the same storage, regardless of being primary or replicas. Because Aurora is built to scale, a cluster volume can grow to up to 64TB in size.

The cluster data is replicated six times across three AZs, making it extremely durable. Aurora can also tolerate two failures without writes being impacted and three failures before reads are impacted. Aurora storage is also automatically configured for auto-healing. This means that if any physical storage fails, the instance will instantly fail over to healthy storage until the failed physical storage can be replaced.

### Backtrack

Because Aurora is constantly backing up to S3, it allows for point in time restorations using backtracking. This is not a good replacement for traditional backups, but is generally suitable for recovering from user errors.

Additional information on Backtrack can be found [here](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Backtrack.html)

### Cluster Architecture

The following has been taken from the Orion Papers offered by Linux Academy:

* Cluster volume scales automatically, only bills for consumed data, and is constantly backed up to S3.
* Aurora replicas improve availability, can be promoted to be a primary instance quickly, and allow for efficient read scaling.
* Reads and writes use the **cluster endpoint**.
* Reads can use the **reader endpoint**, which balances connections over all
replica instances.

![Screen-Shot-2020-05-14-at-11.51.56-PM](https://cdn.levine.io/uploads/images/gallery/2022-09//05/Screen-Shot-2020-05-14-at-11.51.56-PM.png)

![Screen-Shot-2020-05-15-at-12.06.28-AM](https://cdn.levine.io/uploads/images/gallery/2022-09//05/Screen-Shot-2020-05-15-at-12.06.28-AM.png)

### Best Practices

As mentioned in the above image, there are a handful of best practices to remember regarding resiliency and scaling that I'll list below:

* To improve resiliency, use additional replicas
* To scale **write** workloads, scale up the instance size.
* To scale **read** workloads, scale out (add additional replicas)

## Aurora Serverless

The Orion Papers describe Aurora Serverless as follows:
> Aurora Serverless is based on the same database engine as Aurora, but instead of provisioning certain resource allocation, Aurora Serverless handles this as a service. You simply specify a minimum and maximum number of Aurora capacity units (**ACUs**) — Aurora Serverless can use the **Data API**.

![Screen-Shot-2020-05-15-at-12.18.01-AM](https://cdn.levine.io/uploads/images/gallery/2022-09//05/Screen-Shot-2020-05-15-at-12.18.01-AM.png)

## Additional Resources

There are additional topics that lend to database migration and working with queries. Because of the level of detail involved in discussing these topics, I'm going to link the resources provided by Linux Academy that cover these topics.

* [Migrating an RDS MySQL Snapshot to Aurora](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Migrating.RDSMySQL.Import.html)
* [Testing Amazon Aurora Using Fault Injection Queries](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.FaultInjectionQueries.html)
* [Working with Parallel Query for Amazon Aurora MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-mysql-parallel-query.html)

## To Be Continued

This marks the end of part 2, and the SQL end of AWS databases. Part 3 will focus on NoSQL databases, specifically DynamoDB.
