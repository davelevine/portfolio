---
title: Jamstack
categories:
    - Knowledge
    - Recommended
date: "2021-03-14T14:13:00Z"
description: This article will be a quick write-up on my static website hosting on Cloudflare Pages, also known as Jamstack.
---


## Summary

This article will be a quick write-up on my static website hosting on [Cloudflare Pages](https://pages.cloudflare.com), also known as Jamstack.

## Site Migration

I decided to go through the exercise of exporting both my knowledge base and my blog into Markdown to host them as static websites. Static sites have a much lower attack surface, and have a lot less dependencies. In my case, both Bookstack and Ghost rely on MySQL, and are both currently living inside Docker containers.

Because of Jamstack, static sites are incredibly easy to host, and even easier to work with. There's no worrying about the setup and maintenance of underlying infrastructure or having to scale up or down based on load. All of this is done for you behind the scenes.

## Challenges

Easily the biggest challenge was to export the content for both of these.

### Bookstack

Bookstack was a nightmare because it doesn't allow you to export to Markdown. I was forced to leverage Gitbook, which is convenient in that it writes content by default in Markdown and can automatically shuttle the content to a GitHub repo. The challenge though, was that because there was no easy or clean way to do this, I had to export everything an article at a time and create the entire site hierarchy.

Speaking of creating the site hierarchy, although everything was exported appropriately, it's not that simple to just take your markdown and sent it up to a Jamstack host. It needs to first be worked into a static site generator.

For Bookstack, I chose to use MkDocs, particularly because it allows for quick and easy editing and rebuilding. It's Python based and as long as the hierarchy is right, it just works. The hard part is that the hierarchy isn't automatically created for you. It needs to be written out using the folder hierarchy in YAML with each line displaying the relative path of the file.

Needless to say, it took awhile, but I'm happy with how it turned out.

### Ghost

Ghost was challenging for similar reasons, except that I wanted to maintain the metadata from Ghost in my export. There are a ton of export tools out there for Ghost, and even an option for running Ghost headless that I couldn't wrap my head around.

After an exhausting trial and error with Jekyll, Docsify & Eleventy, I finally settled on Hugo. Hugo was honestly the easiest to work with, and it's quick. The content doesn't need a lot of structuring and the themes can all be added as git submodules, which isn't too bad once you get the hang of it.

I used ghostToHugo to export the site content, and it exported everything cleanly using the Ghost API. All the metadata was intact and the content was there. I tried a few themes, but finally settled on one called Hermit (how fitting considering the times we live in). It's a clean and minimal theme that just worked. I had looked into two others, but I was either fighting with it because of JavaScript errors or because I just didn't really like it at the end of the day.

## Hosting

Ideally, I wanted to host everything on GitHub Pages, but this is problematic for me because the repos would need to be public. Because of the sensitive information that I have in Bookstack, I absolutely cannot have it public.

There were a few other hosting providers I looked into — Netlify, Cloudflare Pages & DigitalOcean Apps. I even tried hosting in an S3 bucket, but although it's by far the most robust solution, it's clunky at best and requires a lot of moving parts and work.

I figured I would try DigitalOcean Apps because I already use DigitalOcean heavily. It's got a super slick interface and is easy to connect the repos to, but ultimately, it was annoying to get setup. I kept running into issues where the build would complete successfully, but the site would return a 404 error.

I didn't want to use Netlify if I didn't have to because I really just didn't want to sign up for another site. Because of that, I chose Cloudflare Pages. I already run my DNS and all my domains through them, so this would just be another extension of it.

Long story short, it works and works well, but takes a lot of additional work to get the sites to build properly. This bothered me because I had no problem with building and serving the content from the local webserver, but Cloudflare Pages requires additional configuration such as requirements documents for MkDocs and additional work with identifying submodules for Hugo.

Because Cloudflare Pages is still in open beta, I'll forgive it for the clunkiness. Some of this may even be my fault, especially since I've only been working on this stuff for around a week now.

## Closing Thoughts

After getting everything up and running, I'm really happy with how easy it is to maintain. All the heavy lifting is done at this point, unless I want to change a theme or a submodule, so at this point, all I have to do is write content.

I'm not going to decommission Bookstack, Ghost or the managed MySQL DB on DigitalOcean for awhile. I want to really make sure this works well for me, because once I get rid of them, there's no going back.

Something I could do now that I think about it is just export the DBs and run MySQL locally. I've said it before, and I'll say it again — I'm not a DB administrator, plain and simple. If a DB gets hosed for any reason, there's little I can do to fix it.

I'll weigh the pros and cons and ultimately make a decision in the next few months. I'll still be keeping both Bookstack and Ghost up to date for the time being, just in case I decide to abandon this path. For now, I'm enjoying this new lightweight setup, and I'm hoping it ends up working out for the best.
