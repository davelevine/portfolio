---
title: Virtual Private Cloud (VPC)
authors: [davelevine]
categories:
    - AWS
    - Knowledge
date: "2020.04.19"
description: A summary of my experience and insights gained from the Virtual Private Cloud (VPC) section of the AWS Certified Solutions Architect course.
---

<!--markdownlint-disable-->

## Introduction

I just finished the Virtual Private Cloud (VPC) section of the AWS Certified Solutions Architect course and I wanted to write it out in order to gain some clarity around it.

For some reason, this has been the hardest topic of the course so far. There were certain things that were easier than I thought they'd be (subnetting), while others were much more difficult (NAT Instance vs NAT Gateway).

<!-- more -->

## VPC

VPCs are essentially a private network that various instances and other architecture reside in. In AWS, every environment starts within a default VPC. This default VPC has basic functionality such as DHCP, Internet access, etc. While this is all very basic, building one from the ground up is where it becomes challenging.

## Network Design

Designing and building a custom VPC from scratch is not easy. There's a lot that goes into the architecture and should be fully realized before being implemented.

During the VPC section of the course, I was required to build and connect the following during the lab portion:

* VPC
* Subnets
* Internet gateway
* NAT gateways
* Bastion host
* Route tables
* Security groups
* Network access control lists (NACLs)

All the concepts individually are not very difficult to understand, but putting them together to work seamlessly is another story.

## Design & Build

### Diagram

The following is what was required to be built for this lab, and what I'll be discussing below:

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//04/lab_diagram_customvpc.png" alt="lab diagram custom VPC" />

### Creation of VPC and Subnet Architecture

The creation of the VPC was straightforward, although it's important to consider the CIDR block range before proceeding. The default VPC in AWS starts you off with a 172.31.0.0/16, which provides 65,536 private IPv4 addresses. This is suitable for most projects, regardless of scale. This lab used 10.0.0.0/16, which ends up being the same amount, but just using a different CIDR range.

The lab has you create a three Availability Zone (AZ), three-app tier subnet layout while leaving spaces for a fourth AZ and fourth tier. This is already outside the scope of anything I've ever worked with.

The layout looked like the following:

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//04/Screen-Shot-2020-04-19-at-10.12.41-AM.png" alt="Screen Shot 2020-04-19 at 10.12.41 AM" />

10.0.12.0/24, 10.0.13.0/24, 10.0.14.0/24, and 10.0.15.0/24 were reserved for the fourth tier in four AZs.

### Creating the Internet Gateway, Public Routing, and Bastion Host

This is where I feel I lost my way. Setting up the subnets for DHCP was fine, but assigning those subnets to an Internet Gateway and then configuring the route table, as well as public routing to associate with those subnets threw me for a loop.

The main points to remember are:

* Create the Internet Gateway and attach it to the VPC.
* Create a route table and set the destination to 0.0.0.0/0. Repeat for ::/0 (IPv6)
  * Point it to the Internet Gateway.
* Open the route table and tag the required subnets.

### Bastion Hosts

I've never heard this terminology prior to this course. I've always known them as `jump boxes`, but I understand why `bastion host` is used. This section didn't give me much trouble as I was already familiar with them, but I just wanted to point a real world example for future reference...

At my job, I often have to run a SQL query to obtain foreign grant sponsors for reporting. Because I have to run the query from a Production database, the security around it is tight. The jump box lives on a server and hosts MS SQL Server with access to the Production database. I have access to RDP into the server and appropriate credentials to run these queries.

### NAT Gateway

Allows for private instances to gain access to the public Internet and/or other AWS services. The Internet cannot initiate a connection with those instances.

From the [AWS Documentation](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html):

> The following diagram illustrates the architecture of a VPC with a NAT gateway. The main route table sends Internet traffic from the instances in the private subnet to the NAT gateway. The NAT gateway sends the traffic to the Internet gateway using the NAT gateway’s Elastic IP address as the source IP address.

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//04/nat-gateway-diagram.png" alt="NAT gateway diagram" />

Three different NAT gateways were required to be created for this portion of the lab, one for each public subnet.

### Routing

At this point in the course, I was required to create three private route tables and associate the private subnets from the same AZs. After associating the subnets, each route table needed to be assigned to a NAT gateway.

### Security Groups

After running pfSense in my own lab, along with running multiple hosts from DigitalOcean, I'm pretty familiar with firewall configuration.

The final portion of the lab was to allow only SSH connections from the bastion host to the internal resources. After configuring the security group and adjusting the network ACL to explicitly allow/deny inbound traffic from my IP, the lab was finished.

## Conclusion

As I said in the beginning and a few times throughout, this was not an easy section of the course. It took me a few times to pass the exam at the end of the section. I even had to go back and watch two of the videos in order to get a better understanding of things before attempting the practice exam again.

Of course, there are more advanced VPC topics, which is the next section I'll be working through. All of this has really made me think of network design differently, so I'm looking forward to continuing on with the course and learning as much as I can.
