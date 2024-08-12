---
title: The Road to Better Email Security
categories:
    - Recommended
    - Security
date: "2021.02.08"
description: A detailed account of my week-long journey to enhance email security and privacy.
---

<!--markdownlint-disable-->

## Preface

This is going to be a pretty long post as the project has span almost an entire week. I think in order to understand where I am today, it's worth knowing where I started.

<!-- more -->

## Gmail

I've had a Gmail account since it was in beta around 2004/2005 and have been using it ever since. Those were much simpler times back then, and even though privacy was a big deal back then, it was hardly the nightmare it is today.

Because I've used it for so long, it's become integrated in every corner of my online life. Every service, subscription, person I know, etc, all has my Gmail email address. Although email is not a primary way of contacting me, it still gets a lot of use based on the amount of emails I get. I've cut that down a lot, but I'd say I still receive between 10-15 per day, give or take.

I'm well aware of the sheer lack of privacy that Gmail inherently comes with, but cutting Gmail out of your life is hardly an easy task. So what to do? Enter ProtonMail.

## ProtonMail

Back in 2016, I wanted to try and branch away from being so heavily reliant on Gmail, and particularly Google. I began using different search engines like DuckDuckGo, using password managers, etc. This was all well and good, but I still had crappy email hygiene.

After finding and subscribing to Protonmail, I felt like I had a much more secure form of communication, and although I did, it felt a lot like starting over. No one had this address — no companies or people — so I had a blank slate. I started adding more important communications to it, but it was a big ordeal to slowly transition things over to it. It was something I tinkered with, but as usual, life got in the way, and it got used sparingly.

## SimpleLogin

Nowadays, with Google scanning everyone's emails and prying into as much of your digital life as possible, it's gotten to the point where I want to scale back on my exposure. I was browsing Reddit and came across the idea of email aliases. I had a cursory understanding of it, but decided to look into it further because it seemed like something I could make good use of.

The more I looked into it, the more I kept seeing a company called [SimpleLogin](https://simplelogin.io). Their service allows you to link your personal inbox to a seemingly unlimited number of aliases. The following diagram from their website shows how it works.

<Image src="https://cdn.levine.io/uploads/images/gallery/2022-09//02/hero.svg" alt="SimpleLogin Diagram" />

I found this concept to be a game changer because you can seemingly create an alias for every service you use. Not only that, but you can add a PGP key to each mailbox to encrypt everything that is sent to that alias (more on that later). Having virtually every email that arrives at my mailbox be encrypted, and also see exactly who is selling your email address should you start getting spam to a certain alias? Sign me up!

This is where things became work. Although I signed up for the service, linked both my Gmail and ProtonMail (because why not?) to SimpleLogin, I now had to go through the arduous task of updating my email address everywhere. To save from the chore of going into detail on this, let's just say that ~16 hours over two days and 130 email aliases later, I finally updated everything I could. There were some exceptions, however, where some services just won't let you update your email, as well as some important services that I don't want tied to an alias.

This has been a giant leap forward, but I still wanted to take it a step further. Being able to have everything sent to alias addresses is great, but this only brings the privacy end of it so far. Google still has the ability to scan the information in my inbox, so although it's not nothing, all that's really been accomplished is giving the services I use one less bit of contact information. Since SimpleLogin also natively includes PGP, I wanted to take full advantage of that so all the emails received will be encrypted.

## Pretty Good Privacy

Making use of PGP is not an easy task, and I'm sure that people much better than I am also struggle with it. It's not so much getting setup, but managing encryption keys is not an easy task. Admittedly, when I started this project, I had very little understanding of PGP. I knew it was a way of encrypting your email with a cryptographic key, but that's basically as far as it went.

Probably the most important thing about PGP is being able to verify that the information being sent to you has not been modified along the way. Also, very important is ensuring that the information being sent to you is from whom it claims to be from. Both of these points can be accomplished by using PGP. Again, since I knew very little, I didn't really know where to create a PGP key pair (public and private key).

The more I looked around, the more I kept seeing [Mailvelope](https://www.mailvelope.com/en/). It's basically a browser extension that allows you to encrypt emails with PGP. It integrates with a number of email providers, including Gmail. What's great about this is that it doesn't require you to trust anyone with key management or the use of the PGP keys as everything runs directly on the browser itself. The downside of this is that in my case, I have multiple computers, so I needed to setup Mailvelope manually on both computers.

Mailvelope allowed me to create a key pair, to which I took the public key and added it to SimpleLogin. Once PGP was enabled in SimpleLogin and the public key was added, it automatically enabled PGP on all aliases so everything coming into my inbox that isn't sent directly to my Gmail account is now encrypted and signed with my public key.

Mailvelope also allows for API integration into Gmail so that I can send encrypted emails and/or at least sign them with my key. I spent a lot of time testing this, and it works flawlessly. Now all that was left to do was to safely store my keys. I made use of the Mailvelope key server as the functionality is already built into the extension, but also uploaded it to <https://keys.openpgp.org>. This allows it to be searchable, which is pretty slick. I also exported the public key, private key and the combined key and stored them in Bitwarden as attachments.

## Closing Thoughts

This has been a long overdue exercise that I feel has really brought my email into the 21st century. The only caveat to having this setup is that I'm not really able to view these encrypted emails on my phone. I'm in the process of working on this, although at the moment with being home all the time, it's not really that big of a deal. To be honest, if I never got it figured out and had to rely on my desktop or laptop to these emails, I'd be alright with that.

Although the idea of privacy is more of a myth nowadays, it should always be something to strive for. If I can freely give out less information and keep some more of it private, I'll put in the work. Even though I've only had this setup for a few days, I feel that it's already a huge improvement.
