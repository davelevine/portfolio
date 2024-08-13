---
title: Choosing a Routing Policy
categories:
    - AWS
    - DevOps
    - Knowledge
date: "2020.04.29"
description: A high-level overview of DNS and the various routing policies available in AWS Route 53.
---

## Baseline

I'll start by saying I have a very general understanding of DNS. I know it's often dubbed the “*internet phone book*” and that it translates IP addresses into URLs. I know some of the various DNS record types off the top of my head — A, AAAA, CNAME, MX, TXT — along with how each of them are used, but mostly at a high level.

As a baseline...

> * `A record` — an IPv4 record that corresponds with an IP address and the domain name it corresponds with.
> * `AAAA record` — same as an A record, but for IPv6 only.
> * `CNAME` — alternate name for an A record. Generally used with subdomains.
> * `MX record` — short for Mail Exchange and is associated with email servers.
> * `TXT records` — associates arbitrary text or information to a domain name.

## Route 53

My entire homelab, although traveling through a VPN to leave my network, passes through Cloudflare. It's where I have my domains registered and all traffic proxied, so getting my feet wet with Route 53 felt very different; more involved.

As I mentioned in the preface, my experience with DNS is limited in comparison to Route 53. Although the breadth of features is incredibly varied, I wanted to focus this post on the various different routing policies and how they affect traffic traversing through Route 53.

## Routing Policy

In routing policies, the policy defines the behavior of the service. There are trade-offs that need to be understood before being implemented. Each policy will be outlined below.

### `Simple routing`

Simple routing is a generic routing of a service such as a web server that gives function to a domain. My understanding is that it's the closest to Cloudflare, for example, in the sense that a single IP is assigned to a single domain name.

### `Failover routing`

Failover routing is routing that exists with an active-passive configuration such as a primary and disaster recovery site. Failover is determined with healthchecks done within Route 53. If a resource replies to a healthcheck based on pre-determined criteria, the resource is deemed healthy and passes the check. If it doesn't, the route is automatically switched to the secondary failover site.

An example of the healthchecks interface can be seen below:

![healthchecks](https://cdn.levine.io/uploads/images/gallery/2022-09//04/1_H4_Es0n0UVn4DeHMOIkN8w.png)

`Source`: [Amazon Route 53 — Routing Policies](https://medium.com/tensult/amazon-route-53-routing-policies-cbe356b851d3)

### `Geolocation routing`

Geolocation routing is used when there is a business need to have particular traffic routed to a specific set of users within a geographic region.

### `Geoproximity routing`

Geoproximity routing is used when there is a need to route traffic based on the location of resources. Relies on Route 53 traffic flow. When routing to AWS resources, it routes closest to the AWS Region the resources were created in. For non-AWS resources, it routes based on latitude and longitude.

`NOTE:` A diagram of both Geolocation and Geoproximity routing can be seen below...

![routing](https://cdn.levine.io/uploads/images/gallery/2022-09//04/Screen-Shot-2020-04-29-at-12.09.52-AM.png)

### `Latency routing`

Latency routing can be used when resources reside in multiple regions. When implemented, it will automatically route to the region with the least amount of latency.

### `Multi-value answer routing`

This is one that I'm not entirely clear on and wasn't covered in much detail in the AWS Certified Solutions Architect course. Because of that, I'll list the explanation from the AWS documentation below.
> Multivalue answer routing lets you configure Amazon Route 53 to return multiple values, such as IP addresses for your web servers, in response to DNS queries. You can specify multiple values for almost any record, but multivalue answer routing also lets you check the health of each resource, so Route 53 returns only values for healthy resources. It's not a substitute for a load balancer, but the ability to return multiple health-checkable IP addresses is a way to use DNS to improve availability and load balancing.
>
> `Source` — [Choosing a Routing Policy](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html)

### `Weighted routing`

Weighted routing is used to route traffic based on proportions that you specify. This is best used in testing and not necessarily in Production. An example of this works by specifying two values for two separate instances that combined add up to an arbitrary number. For example, one instance is assigned the number 90, while the other instance is assigned the number 10. Whichever instance has the highest numerical value, that instance will receive the most traffic.

## Re-baselining

Writing out the definitions for the different types of routing policies in Route 53 has in itself been a learning experience. I need to study these a bit more because they're not obvious to me yet, particularly the policies concerning geographic locations.

It's easy to see how much there is to know about Route 53 compared to traditional DNS. Aside from the difficulty in understanding certain routing policies, it's eye-opening to see what else is possible to get out of DNS.
