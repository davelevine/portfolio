---
title: Infrastructure as Code (IaC)
categories:
    - Knowledge
date: "2025-11-27T11:58:00Z"
description: This post explores how far my homelab has come with a GitOps approach, and where to go from here.
---

## Summary

Over the last 8 months or so, I've been doing a significant restructuring of the way that I work in my homelab. It's not that there was anything wrong with it, per se, but rather that I wanted to challenge myself to do it better.

I'd been putting off learning Ansible for years, and life just seemed to have a way of bringing it up every now and then. I'd see something in a blog post, on Reddit, on YouTube, at work, etc. talking about how great it is. I knew this instinctively based on what I already knew about it, but I hadn't really gotten into the finer details yet.

Beyond knowing that I really needed to stop putting this off, I began to take stock of how much time I was putting into my homelab that I should've been putting into my family. I'd find myself playing with my kids, but my head would be thinking about different aspects of my homelab. All this did was just make me sad, and realize that something had to change.

## Ansible

Something that I often have a hard time with is just starting. There often never really feels like a good time to do anything, and I know I'm not alone in this. I did a casual look around on YouTube for some sort of tutorials to get me going. I'd heard that [Jeff Geerling's Ansible 101](https://www.youtube.com/watch?v=goclfp6a2IQ&list=PL2_OBreMn7FqZkvMYt6ATmgC0KAGGJNAN) course was fantastic so I started there. Personally, I couldn't get into it for some reason. It's not a dig against the course itself, but lets just say it wasn't for me.

I looked for a different course and found the [Getting Started with Ansible](https://youtube.com/playlist?list=PLT98CRl2KxKEUHie1m24-wkyHpEsa4Y70&si=kemKLmTPirXDCgKN) course from Learn Linux TV and that was it for me. I finished the course in a few days and I already felt like I had a good foundation.

Finishing a course and doing the work are two very different things. The first weeks of [homelab-iac](https://github.com/davelevine/homelab-iac) were rough. I'd write a role, run it, watch it blow up, fix it, watch it blow up somewhere else, and repeat. A lot of that was me not yet having a real intuition for idempotency. I'd write a task that worked the first time and then changed something the second time, which is the opposite of what you want. I'd trip over `become`, over file ownership, over the order in which I was applying things. None of it was hard in the way that hard problems are hard. It was just a thousand small papercuts before any of it started to feel natural.

The harder part wasn't writing Ansible, it was unlearning years of muscle memory. I'd been SSHing into boxes and fixing things by hand for so long that the impulse to do it that way was reflexive. I'd catch myself five minutes into a manual fix, sigh, back out, and go write a role for it instead. That happened more times than I'd like to admit, and it kept happening for months. The tooling was the easy part. Trusting the tooling enough to stop reaching for the shell was the harder part.

I also had to be honest with myself about what was on those boxes. Importing existing state into Ansible meant looking at every config file on every host and asking what it was, why it was there, and whether I still needed it. I found `cron` jobs that hadn't run successfully in over a year. I found half-configured services from experiments I never finished. I found two different ways of doing the same thing on two different hosts because I'd forgotten how I'd solved it the first time. None of that was a surprise, exactly, but seeing it all laid out next to each other was humbling.

A couple of weeks in, I started writing things down. I added an [ADR](https://en.wikipedia.org/wiki/Architectural_decision) directory to the repo and started capturing decisions as I made them. I'm not religious about ADRs in the corporate sense, but having a place to write down "I picked X over Y for these reasons" has saved me from re-litigating the same question with myself months later. There are 70+ ADRs in the repo at this point, and I refer back to them more than I expected to.

## OpenTofu

With Ansible doing real work, the next thing to tackle was the stuff I'd been clicking through web UIs to manage for years. DNS records across a handful of domains, my Hetzner VPS, Cloudflare Tunnels, R2 buckets, firewall rules. None of it was in code, and if I lost any of it, I'd be reconstructing from memory and old screenshots.

I went with [OpenTofu](https://opentofu.org/) over Terraform. The fork happened for reasons I won't relitigate here, but the practical effect for me was that I could keep using the ecosystem I already knew while supporting a project I actually wanted to support.

Importing existing infrastructure was, again, less about the tool and more about confronting how much cruft I'd accumulated. I had DNS records pointing at services I no longer ran. I had a domain I no longer owned that still had records configured. I had two zones that did almost the same thing for reasons I couldn't reconstruct. Codifying it forced me to deal with all of it. The first OpenTofu plan against my real account was hundreds of lines long, and most of those lines were me figuring out what to delete.

The thing I'm most happy with on the OpenTofu side is how state is handled. State lives in Cloudflare R2, and credentials are pulled out of Bitwarden Secrets Manager at runtime via a small wrapper script. Nothing is on disk, nothing is in my shell history, and nothing is in environment files I'd have to remember to clean up. It's a small detail, but it removed an entire class of mistake I used to worry about.

## GitOps

Once Ansible and OpenTofu were doing real work, the next obvious question was how to run them. The whole point of all this was to stop doing things by hand, and a workflow where I have to remember to run `ansible-playbook` from my laptop is just doing things by hand with extra steps.

I settled on self-hosted GitHub Actions. Rather than leaning on GitHub-hosted runners, I provisioned a Raspberry Pi as the runner host and stood up three runner instances on it so workflows can run concurrently instead of queueing up behind each other. The Pi sits inside my network, on Tailscale, and has line of sight to all of my hosts. That means a workflow can SSH directly into Xenlab or my Hetzner VPS without me exposing anything externally or punching holes through firewalls.

It's a simple setup to describe, but it took a long time to actually get right. A push to `main` triggers the relevant workflow based on what changed. If a Docker Compose file changed, the deploy-compose workflow runs the corresponding Ansible role on the affected host. If a Terraform file changed, OpenTofu plans and applies. A weekly package-updates workflow runs `apt` upgrades across every host and reports drift back to a Healthchecks.io endpoint, which then pushes a notification via Ntfy if anything looks off.

Getting it reliable took a while. Playbooks would intermittently fail because Bitwarden Secrets Manager was being hit too many times in parallel and the run would race against itself, until I serialized host execution to keep BWS lookups from piling up. Compose files on hosts would slowly drift out of sync with the repo when a deploy was interrupted partway through, and reconciliation didn't always notice. Sorting that out took a multi-PR effort to detect drift, self-heal it, pre-resolve sudo passwords once per run instead of per-task, and fix a callback plugin that was reporting "success" for tasks that had actually skipped. None of it was glamorous, but all of it had to happen before I could walk away from the system.

The first time I watched a Renovate PR open, auto-merge after CI passed, and roll out via deploy-compose without me touching anything, it felt surreal. I'd been doing all of that by hand for years. It also broke a few times before it stopped breaking, and I had to fight the urge to disable the automation every time it did.

## Secrets

Secrets management was something I'd always handled poorly. I had a `.env` file here, a Bitwarden entry there, and a handful of values living in my shell history because I was in a hurry one time and never came back to clean up. It was bad, and I knew it was bad.

[Bitwarden Secrets Manager](https://bitwarden.com/products/secrets-manager/) ended up being the answer. It has a real Ansible integration via a lookup plugin, which means I can reference a secret by its ID directly inside a playbook and have it resolved at runtime. The secret never gets written to disk, never gets committed, and never lives anywhere it shouldn't. The same approach works for OpenTofu via the wrapper I mentioned earlier.

The migration itself was painful. Every secret had to be moved into the vault, every reference updated, every old copy tracked down and removed. There was no clean cutover, just weeks of grepping for anything that looked like a secret and following the trail. Worth it, but I wouldn't pretend it was a quick afternoon of work.

## Monitoring

A homelab without monitoring is just a collection of things you'll find out are broken when you try to use them. Before this rebuild, I was using [Uptime Kuma](https://uptime.kuma.pet/) for health checks and a patchwork of other things for everything else. Uptime Kuma was fine, but I wanted something configured in code rather than clicked into a UI.

I consolidated around four pieces. [Homepage](https://gethomepage.dev) is my dashboard, and it's the first thing I see when I open a browser tab. [Gatus](https://github.com/TwiN/gatus) replaced Uptime Kuma for health checking, and because it's configured in YAML, the entire thing lives in the repo alongside everything else. [Beszel](https://beszel.dev/) handles host-level metrics. [Ntfy](https://ntfy.sh) is the pipe through which everything reaches my phone.

[Healthchecks.io](https://healthchecks.io/) sits alongside all of that as my dead-man's-switch monitor for systemd timers and cron jobs. If a backup doesn't check in on time, I know about it. If a package-updates run skips a host, I know about it. The mental load of "I hope that thing ran" is gone, and that alone has been worth it.

The reverse proxy story is similar. I'd been on [Nginx Proxy Manager](https://nginxproxymanager.com/) for years, mostly out of inertia. I migrated to [Caddy](https://caddyserver.com/) so the configuration could live in the repo, and swapped [Authentik](https://goauthentik.io/) for [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) plus [Pocket ID](https://pocket-id.org/) because Authentik was more service than I needed. Each migration took a weekend with its own set of gotchas. The cumulative effect is that nothing in the path between the public internet and my services is configured by hand anymore.

## Where Things Stand

Once the foundation was in place, the homelab stopped feeling like a project and started feeling like infrastructure. The pace of changes has actually picked up rather than slowed down, which I think is the real test of whether GitOps was worth it. A few of the things that have happened since I started drafting this post:

- **B2 to R2 migration.** I'd been on [Backblaze B2](https://www.backblaze.com/cloud-storage) for years for backups and CDN content. [Cloudflare R2](https://developers.cloudflare.com/r2/) made more sense long term, especially with zero egress fees and how much of my traffic already flows through Cloudflare. The CDN domains moved to R2 custom domains, the backend objects moved over, and an ADR captured the rationale.
- **An Astro Starlight docs site.** The homelab documentation had been spread across READMEs and a Bookstack instance, neither of which was great. I set up a [Starlight](https://starlight.astro.build/) site that lives next to the code at [wired.io](https://wired.io). I tried to migrate the site from Cloudflare Pages to Workers about a week after standing it up, hit a problem I didn't want to debug at 11pm on a Friday, and reverted it back to Pages. That revert is sitting in the git log staring at me, and I'll come back to it eventually.
- **Dotfiles via chezmoi.** I added an Ansible role that bootstraps [chezmoi](https://www.chezmoi.io/) on any new machine and pulls down my dotfiles. Going from "format a laptop and spend an evening getting it back to the way I like it" to a single command is genuinely satisfying.
- **A multi-week Postgres detour for Journalistic.** I run a small open-source project called [Journalistic](https://github.com/davelevine/journalistic), and at one point I decided to move its storage from SQLite plus [Litestream](https://litestream.io/) over to PostgreSQL with point-in-time recovery. The plan was restic for `pg_dump` snapshots and [WAL-G](https://github.com/wal-g/wal-g) for WAL archiving to R2. WAL-G didn't fit, so I swapped to [pgBackRest](https://pgbackrest.org/). pgBackRest wasn't the right shape either, so I tried barman-cloud via the [CNPG](https://cloudnative-pg.io/) image with gzip-compressed WAL and base backups. By the time I got it working, I had to admit the operational surface area was way more than the project needed. I ripped it out and reverted to SQLite plus Litestream. The detour cost weeks. I learned a lot about WAL archiving, but mostly it was a lesson in knowing when to stop.
- **Retiring MinIO in favor of VersityGW.** MinIO had been my on-prem S3 layer for years, but the [upstream repo](https://github.com/minio/minio) is now flagged as no longer maintained, the community edition is source-only with no binary releases, and everyone is being funneled toward [AIStor](https://min.io/product/aistor), their commercial offering. I'd already been on a community fork (firstfinger, then pgsty) to keep up, and that started feeling like a treadmill ending somewhere I didn't want to go. I piloted [VersityGW](https://github.com/versity/versitygw) alongside MinIO on Xenlab, and once it was stable I phased the decommission into five PRs so each step was independently revertable: remove the service, swap the Caddy block and DNS, replace the Gatus check, swap the Homepage tile, and drop the SMB mount. MinIO is fully retired now. The pilot was not smooth. CORS had to be set explicitly for the WebGUI, the healthcheck had to be TCP instead of HTTP, the backend had to come off SMB onto local disk because of file locking weirdness, the external gateway URL had to be advertised correctly to the WebUI, and the Sharrr IAM credentials had to be resolved directly from Bitwarden when the indirect path didn't work. Each fix was small. Collectively they were the kind of grind that doesn't show up in a feature list.

None of these are huge headline features. They're the kind of small, steady improvements that I never used to make because the cost of touching anything was too high. With everything in code, the cost is now low enough that I just do them. That doesn't mean any individual change is easy. It means the friction is in the actual problem, not in the act of making the change.

## What I'd Do Differently

If I were starting over, I'd be more disciplined about doing one thing at a time. There were stretches with Ansible refactors, OpenTofu imports, secrets migration, and a Caddy cutover all in flight at once, and when something broke, figuring out which moving part was responsible was much harder than it needed to be. The repo has plenty of evidence of me untangling something I'd accidentally tangled up myself.

I'd also be more skeptical of my own enthusiasm. The Postgres detour is the obvious example, but not the only one. Several times during this rebuild I followed a thread longer than I should have because I'd already invested time and didn't want to admit the thing I was building wasn't the thing I needed. The willingness to delete a week of work and go back to the simpler answer is a skill, and I'm still building it.

## Where to Go From Here

The next stretch is more about polish than new construction. I want to get to the point where every host can be reprovisioned from scratch with no human in the loop beyond kicking off the first playbook. I'm close, but not there yet. There are still a handful of bootstrap steps that need me to do something by hand, and each one is a small failure of the larger goal.

Beyond that, I'd like to extend the GitOps approach to the corners of my setup I haven't touched yet. My pfSense config is still managed through its web UI. My UniFi controller config is managed by the controller itself, which is fine until the day it isn't. Both are candidates for the same treatment, though I haven't decided whether the juice is worth the squeeze.

The thing I keep coming back to is that the time investment up front buys back time on the other end in a way that compounds. I spend less time fighting my homelab now than I did a year ago, even though it does more, because the friction of any individual change is so much lower. That doesn't mean I never spend a Saturday chasing a sudo password race condition or untangling a bind mount that should have been straightforward. It means that when I do, the work is captured in code at the end of it, and I don't have to do it again.

It also gave me back the thing I was actually after, which was being able to be present with my family without my head being somewhere else. The homelab is still here, it still does what I need it to do, and now it mostly takes care of itself. That's the version of this hobby I wanted, and even with all the grit it took to get here, I'm glad I finally put in the work.
