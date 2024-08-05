---
title: Securing Nginx
authors: [davelevine]
categories:
    - Security
date: "2020-09-06"
description: A few weeks ago, I was reading an article on Scott Helme's blog about caching Ghost with Nginx. In doing this, I made this blog and a number of other services that I use kick into overdrive, but that whole endeavor is best left for its own article.
---

<!--markdownlint-disable-->

## Starting line

A few weeks ago, I was reading an article on [Scott Helme's blog](https://scotthelme.co.uk/) about [caching Ghost with Nginx](https://scotthelme.co.uk/caching-ghost-with-nginx/). In doing this, I made this blog and a number of other services that I use kick into overdrive, but that whole endeavor is best left for its own article.

<!-- more -->

While reading that article, I noticed in the sidebar a service that he operates called [Security Headers](https://securityheaders.com/). Essentially, this measures measure how secure the headers of a web server are for a particular website. For kicks, I tried this site and my knowledge base; was I ever surprised by what I found.

Both sites came back with a sobering 'D' rating out of 'A' through 'F'. I wish I had taken a screenshot of this at the time to illustrate what I'm referring to, but unfortunately, I didn't.

These results were particularly concerning because I was under the assumption that I had secured not only the services pretty well, but also Nginx and Cloudflare. I realized quickly that I had a lot to learn.

## Re-evaluation

There were a number of resources I found about securing Nginx, but the problem was making it work for my environment. This was actually a lot harder than it may sound because I had to factor services like Cloudflare into the mix.

For example, I tried the following header that kept cropping up in my research, only to find out that it completely bypassed multi-factor auth:

`proxy_hide_header Set-Cookie;`

The breakdown of the `proxy_hide_header` is as follows:

> By default, nginx does not pass the header fields “Date”, “Server”, “X-Pad”, and “X-Accel-...” from the response of a proxied server to a client. The proxy_hide_header directive sets additional fields that will not be passed. If, on the contrary, the passing of fields needs to be permitted, the proxy_pass_header directive can be used.

Because the header was effectively being bypassed, it was breaking multi-factor auth. To be clear, I have multi-factor auth enabled through [Cloudflare Access](https://www.cloudflare.com/teams-access/) using [Okta](https://www.okta.com/) as the IdP.

## Trial and Error

The amount of trial and error that took place in all this was staggering, but I was finally able to narrow the new headers down to the following list:

* add_header X-Frame-Options SAMEORIGIN;
* add_header X-XSS-Protection “1; mode=block”;
* add_header X-Content-Type-Options nosniff;
* add_header Referrer-Policy “no-referrer”;
* add_header Feature-Policy strict-origin-when-cross-origin;
* add_header hide_server_tokens on;
* add_header Content-Security-Policy “default-src * data: 'unsafe-eval' 'unsafe-inline'” always;

This gave me a nice balance between adding the additional security, while still retaining the performance benefits from the caching directives already put in place.

## Resources

For reference, the resources I used in order to make things work the way I wanted them to are as follows:

* <https://www.keycdn.com/blog/http-security-headers>
* <https://gist.github.com/plentz/6737338>
* <https://8gwifi.org/docs/nginx-secure.jsp>
* <https://www.keycdn.com/support..-security-policy>

## Finish Line

The problem with having this site password protected is that I can't get an accurate read on the headers; only an approximation. This is done by using my knowledge base as a comparison since the same headers and caching are used throughout the Nginx config file.

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//09/Screen-Shot-2020-09-05-at-10.52.32-PM.png" alt="Screen Shot 2020-09-05 at 10.52.32 PM" />

As you can see, my knowledge base headers are in great shape, which effectively means the headers for this blog are in great shape.

This was a good exercise to go through, even though I'm effectively the only traffic going to any of these sites. It's a good reminder that even if you think you've done enough to secure your services, there's always additional work to be done.
