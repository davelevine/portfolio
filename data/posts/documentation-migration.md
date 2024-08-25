---
title: Documentation Migration
categories:
    - Knowledge
    - Tools
date: "2021-03-09T00:31:00Z"
# Start of Selection
description: Migrating my documentation to Markdown has proven to be more challenging than I thought.
# End of Selection
---

## Summary

I realized only within the last few days that it's not particularly easy to migrate my documentation if the opportunity were to arise. To take stock, I have my full set of documentation with the following services/apps:

- Bookstack
- Confluence
- Notion

Although I have my documentation in a number of locations, it's not particularly easy to export all of it into Markdown, which is the format I want all my documentation to exist in. It's not that all the above don't support markdown to some degree, but rather that the export process is cumbersome.

This article will describe the challenges of each service/app, along with the current state of my documentation.

`Edit`: To configure Dracula theme for MkDocs, use this comment as a reference...

<https://github.com/facelessuser/pymdown-extensions/pull/857#issuecomment-602085247>

## Bookstack

To start, Bookstack is one of my favorite apps to write in. The entire app gets out of your way, so you can just write whatever you need to write down. That being said, it stores everything you write in a MySQL database. This is fine if you like working in MySQL and don't mind keeping your data there. The problem is taking it elsewhere in a different format.

My understanding is that exporting documentation from a MySQL database is not something that's particularly easy to accomplish. I looked into it briefly and the two most common types of formats that can easily come out of a MySQL database are .csv files and JSON files. This is fine if you're working with a database, but neither of them would ever convert properly into Markdown.

Again, I'm not implying that it's a bad thing to work in an app that uses MySQL as a backend, but rather that it doesn't make your documentation portable if there isn't some sort of built-in markdown export.

## Confluence

Confluence is probably the first app I used to start writing documentation, so it will always have a special place for me. That being said, Atlassian has moved over to its cloud hosted service, which is clunky and slow at best. Confluence allows you to export your data, but only one space at a time, and the feature is buried in their labyrinth of features. Once you find the export area, the best you'll get is HTML. This is alright if you're cool with working in HTML. I personally am not there yet.

The export of HTML is clean and the one advantage it has is that other services will readily take the export to import into their service (more on this later). I've used it occasionally to import into other services, and it works just fine, but it doesn't get the job done if markdown is what you're after.

## Notion

Notion is second to none when it comes to organization. I personally organize a fair chunk of my life in it, and it's become invaluable to me. I enjoy writing in it because it allows you to write in Markdown and gets out of your way once you learn how to use it.

It even has an option to export into Markdown/csv, which on its face seems awesome. Here's the problem — it doesn't export cleanly at all, especially if you have a lot of tables in your documentation like I do. When you export a page and all the sub-pages below it (this entire knowledge base), it will export somewhere in the neighborhood of 600+ files. This is because if you write one article and have three tables in it, each table will be exported as its own .csv file. The documentation will be exported as a markdown file, but will not contain the tables. In turn, you're left with 4 separate files.

The Notion export is fine if all you do is document things without tables, but for my needs, it wouldn't work.

## Solution

My solution ended up being a weird one, but it ultimately worked.

There's a service called Gitbook that allows you to import documentation from another service and will turn it into Markdown. One of the services happens to be Confluence. What I did was I exported the three spaces I work with (shelves in Bookstack) and imported them all into Gitbook. The result was pretty good, but the organization was largely lost. This is because of the ridiculous way that Confluence chooses for documentation. Because it doesn't allow you to group sections like Bookstack does with chapters, you're left with nesting pages upon pages underneath one another. This is fine if you never leave Confluence, but once you do, your documentation is unstructured. Not to mention that there were some formatting differences between the services.

It took awhile, but I was able to get the documentation structured and the formatting straightened out. The problem was that I didn't want to use Gitbook. It's not particularly polished, and it's a bit clunky to work with. What it does have in its favor is the ability to leverage the GitHub API. I was able to connect my GitHub account to Gitbook, create a documentation repo and shuttle all my documentation into it in Markdown.

Problem solved.

## Conclusion

Although it took awhile, it was an incredibly worthwhile exercise to allow for portability of all my documentation. Not that I'm necessarily going to be leaving the aforementioned services (Confluence may be on the chopping block), but I'd like the option to in case the day arises.
