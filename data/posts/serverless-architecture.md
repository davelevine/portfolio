---
title: Serverless Architecture
authors: [davelevine]
categories:
    - AWS
date: "2020.04.03"
description: An exploration of serverless architecture concepts and their practical applications in cloud computing.
---

<!--markdownlint-disable-->

## Introduction

Serverless architecture is the current topic I'm learning in the [AWS Certified Solutions Architect: Associate](https://linuxacademy.com/course/aws-certified-solutions-architect-2019-associate-level/) course from [Linux Academy](https://linuxacademy.com). It's a bit of a challenge for me because I don't have any real experience with it, but I understand the concepts at a 30,000 ft level.

I'll start with what I know and then get into some theory I've compiled.

<!-- more -->

### Serverless

The term `serverless` has always been a bit of a mystery to me. It's a term I've heard tossed around, but never quite understood what it meant. In any type of architecture that operates or can operate at scale, there are always servers involved, so what does the term actually mean?

Essentially, serverless means either a user or an entity (company) does not personally manage the underlying infrastructure. Comparing this to EC2, serverless does not require you to spin up an instance, manage updates, install software, handle networking, etc. With EC2, all the aforementioned is required. All the responsibility of maintaining an instance or any underlying virtual infrastructure is shifted to the provider with serverless.

What this all boils down to is this — all you're responsible for is the code and any additional libraries that may be required in order to run that code.

### Cost

Quite possibly the most attractive thing about serverless architecture is cost. Because every run of a function uses very little compute power and can run in the span of milliseconds, it costs a fraction of what a traditional VM would cost. With serverless, you only pay for the time it takes to run the function.

### Examples

#### What serverless can be used for

* Checking the temperature of an IoT thermostat
* Ensuring a dynamic IP address is always up to date (DDNS)

#### What serverless should not be used for

* Monolithic applications
* Any application that requires an OS

### Use Cases

Common use cases for serverless architecture can be explained best through the following image:

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//04/x1aeniur0.jpg" alt="Use Cases for Serverless Architecture" />

Obtained from [K&C](https://kruschecompany.com/why-enterprises-choose-serverless-architecture)

### Concepts

In lieu of writing out the concepts one-by-one, the page below from Linux Academy illustrates the serverless architecture perfectly.

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//04/Screen-Shot-2020-04-02-at-9.56.54-PM.png" alt="Serverless Architecture Concepts" />

Obtained from the [Orion papers](https://interactive.linuxacademy.com/diagrams/AWSCSA.html)

### Lambda

Lambda is without question the most popular example of serverless architecture at the time of this writing. My understanding so far is limited, but what I do know can be summarized below:

* Lambda is known as FAAS or Function as a Service.
* The word `function` in this case means an `event`.
* Every function is stateless — each run is completely clean, meaning that functions are isolated from other functions.
* Lambda can integrate seamlessly with other AWS services such as S3, as well as 3rd party hardware and services.
* Lambda can leverage virtually any type of codebase.
* Serverless architecture uses such low amounts of compute power than its scaling potential is infinite.

### Bringing it all together

Serverless architecture is next-gen computing, plain and simple. There will always be a need for traditional instances, but with limitless scaling potential, cost benefits and a bare essentials approach, serverless is here to stay.
