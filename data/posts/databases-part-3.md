---
title: Databases (Part 3)
categories:
    - AWS
    - Knowledge
date: "2020.06.06T09:29Z"
description: I meant to get to finishing this up shortly after my last post, but life comes at you fast sometimes.
---


## Preface

I meant to get to finishing this up shortly after my last post, but life comes at you fast sometimes. No excuses though, as I've been continuing with my course and should be finished within the next day or two. In the meantime, I still have a bunch of content to write, so let's get to it.

The link to the post about Aurora can be found [here](../blog/databases-part-2).

## NoSQL

NoSQL databases are just as they sound — they contain unstructured data that has been added to tables without the use of SQL. In this case, I'm referring to DynamoDB, the AWS NoSQL offering.

_`Because I'm in no way a database guy, I'll be relying a lot on the material from Linux Academy.`_

There are quite a few terms to be aware of when dealing with DynamoDB that I'll outline below...

* `TABLE` — a collection of items that share the same partition key (PK) or partition key and sort key (SK) together with other configuration and performance settings.
* `ITEM` — a collection of attributes (up to `400 KB` in size) inside a table that shares the `same key structure` as every other item in the table.
* `ATTRIBUTE` — a key and value — an attribute name and value.

![Screen Shot 2020-06-05 at 11.26.10 PM](https://cdn.levine.io/uploads/images/gallery/2022-09//06/Screen-Shot-2020-06-05-at-11.26.10-PM.png)

## Capacity Modes

Capacity modes are what DynamoDB uses in order to read/write data to tables.

There are two capacity modes — `provisioned throughput` (default) and `on-demand mode`. Both of which handle performance differently, which is outlined below...

* When using on-demand mode, DynamoDB automatically scales to handle performance demands and bills a per-request charge.
* When using provisioned throughput mode, each table is configured with read capacity units (`RCU`) and write capacity units (`WCU`).

> Every operation on ITEMS consumes at least 1 RCU or WCU — partial RCU/WCU cannot be consumed.

### Read Capacity Units

* One RCU is 4 KB of data read from a table per second in a strongly consistent way.
  * Reading 2 KB of data consumes 1 RCU.
  * Reading 4.5 KB of data takes 2 RCU.
  * Reading 10× 400 bytes takes 10 RCU.
* If eventually consistent reads are okay, 1 RCU can allow for 2 × 4 KB of data reads per second. Atomic transactions require 2x the RCU.

### Write Capacity Units

* One WCU is 1 KB of data or less written to a table.
  * An operation that writes 200 bytes consumes 1 WCU.
  * An operation that writes 2 KB consumes 2 WCU.
  * Five operations of 200 bytes consumes 5 WCU.
* Atomic transactions require 2x the WCU to complete.

![Screen Shot 2020-06-05 at 11.42.46 PM](https://cdn.levine.io/uploads/images/gallery/2022-09//06/Screen-Shot-2020-06-05-at-11.42.46-PM.png)

## DynamoDB Consistency

From the Linux Academy Orion Papers...

> DynamoDB is highly resilient and replicates data across multiple AZs in a region. When you receive a HTTP 200 code, a write has been completed and is durable. This doesn't mean it's been written to all AZs — this generally occurs within a second.
>
> An eventually consistent read will request data, preferring speed. It's possible the data received may not reflect a recent write. Eventual consistency is the default for read operations in DDB.
>
> A strongly consistent read ensures DynamoDB returns the most up-to-date copy of data — it takes longer but is sometimes required for applications that require consistency.

## Provisioned Throughput Calculations

From the Linux Academy Orion Papers...

>A system needs to store 60 patient records of 1.5 KB, each, every minute. What WCU should you allocate on the patient record table?
>
>* 60 records per minute = ~1 per second (and the DDB RCU/WCU buffer can smooth this out if not)
>* Each record is 1.5 KB. 1 WCU = 1 KB per second, so each record requires 2 WCU.
>* A WCU setting of 2 is required on the table.
>
>A weather application reads data from a DynamoDB table. Each item in the table is 7 KB in size. How many RCUs should be set on the table to allow for 10 reads per second?
>
>* 1 item is 7 KB, which is 2 RCU (1 RCU is 4 KB).
>* 10 reads per second for 7 KB items = 20 RCU
>* But the question didn't specify if eventual or strong consistency is required. The default is eventual, which allows for 2 reads of 4 KB per second for 1 RCU.
>* Assuming eventually consistent reads, the answer is 10 RCU.

## Streams

From the Linux Academy Orion Papers...

![Screen Shot 2020-06-05 at 11.51.51 PM](https://cdn.levine.io/uploads/images/gallery/2022-09//06/Screen-Shot-2020-06-05-at-11.51.51-PM.png)

## Indexes

From the Linux Academy Orion Papers...

![Screen Shot 2020-06-05 at 11.52.43 PM](https://cdn.levine.io/uploads/images/gallery/2022-09//06/Screen-Shot-2020-06-05-at-11.52.43-PM.png)

## An Understanding

As I've mentioned before, I'm very far from a database guy, and a lot of this information still doesn't quite click. This may seem like it shows from the way a lot of this is written word-for-word from the Orion Papers. While that's partially true, I also attribute it to the lateness of the hour, and a bit of laziness.

If there's good news to be had, as I was going through this material again, almost all of it felt familiar. Hopefully, as I continue to go through it to prep myself for the exam, it will feel that much clearer to me.

I use ad-hoc reporting tools at work, one of which is from SAP, and it helps to already have some hands-on experience with NoSQL tables. I may still go back and rewatch the Linux Academy training on NoSQL just as a refresher before moving on to practice exams. At this point, I'll use whatever resources I can to better understand the content.
