---
title: API Gateway
categories:
    - AWS
date: "2020-04-06"
description: I have to preface this by saying that I am not a developer. I can read snippets of code and muddle my way through certain things, but coding is not my strong suit.
---

<!--markdownlint-disable-->

## Preface

I have to preface this by saying that I am not a developer. I can read snippets of code and muddle my way through certain things, but coding is not my strong suit.

Having said that, I need to break down API Gateway as much as I can in order to better understand it.

<!-- more -->

### API Gateway

API Gateway is a way of allowing functions from within AWS to communicate with other services within and outside of AWS. This is, of course, a very rudimentary way of explaining API Gateway, but I'll get into it more as I go on. First, it's important to understand what an API is.

### What is an API?

APIs, or Application Programming Interface, are at their core, just snippets of code that allow for one piece of code to interface with another. This allows a piece of software to interface with other software that normally would not be able to.

For example, when an app is downloaded on a phone, the app will have an API that allows for the user to interact with the app. Without the API(s) in place, an OS such as Android would not necessarily be able to communicate with the app, or the experience would be degraded at best.

### Definitions

AWS defines API Gateway as follows:

> *Amazon API Gateway is an AWS service for creating, publishing, maintaining, monitoring, and securing REST, HTTP, and WebSocket APIs at any scale. API developers can create APIs that access AWS or other web services, as well as data stored in the AWS Cloud.
>
> API Gateway acts as a “front door” for applications to access data, business logic, or functionality from your backend services, such as workloads running on Amazon Elastic Compute Cloud (Amazon EC2), code running on AWS Lambda, any web application, or real-time communication applications.*

REST APIs are `HTTP based` and `stateless`, whereas WebSocket APIs use the WebSocket protocol, which makes it `stateful` and allows for sending and receiving information.

So which one is better? The answer is, it depends on what you're doing.

#### REST API

- Utilizes HTTP protocol to transfer information when a user takes action.
- Best used for less frequent requests.

#### WebSocket API

- Utilizes the WebSocket protocol to send and receive information between users and devices.
- Best used with frequent back and forth communications such as chat apps.

### Architecture

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09/04/Product-Page-Diagram_Amazon-API-Gateway-How-Works.png" alt="Product Page Diagram Amazon API Gateway How Works" />

_Obtained from [AWS](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html)_

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09/04/Screen-Shot-2020-04-06-at-12.17.13-AM.png" alt="Screen Shot 2020-04-06 at 12.17.13 AM" />

_Obtained from the [Orion Papers](https://interactive.linuxacademy.com/diagrams/AWSCSA.html)_

### Wrapping Up

There's a lot about API Gateway that I haven't gotten into for two reasons:

- This post would need to be broken out into multiple posts to capture it all.
- I don't know anything more than this about API Gateway at the time of this writing.

I'm sure I'll have more to write once I get into Step Functions in the next lesson.
