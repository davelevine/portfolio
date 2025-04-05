---
title: Automating MinIO File Cleanup
categories:
    - Knowledge
    - Recommended
    - Security
    - Tools
date: "2025-04-05T15:47:00Z"
description: This guide explains how to set up automated file cleanup for MinIO object storage on Ubuntu Server.
---

## Summary

I've been working on a [fork](https://github.com/davelevine/sharrr-svelte) of an end-to-end encrypted file transfer service called [Sharrr](https://sharrr.com) lately. It's been a lot of fun and one of the better learning experiences I've had as of late.

One of the biggest challenges in getting it to work was to refactor the app to work with more than one S3 provider while still maintaining the same level of security...oh, and also not breaking it in the process. After getting this to work with [Backblaze](https://backblaze.com), [Storj](https://storj.io), and [MinIO](https://min.io), I decided that the best one for my needs was MinIO since I could run it locally.

However, another challenge was how do I keep my server from filling up with old files? But first, a bit of background on how I got here.

## Background

This section could certainly be its own blog post, so I'm going to keep it as brief as I can without getting too far away from the scope of this post.

One of the biggest challenges I encountered while digging into this project was that no matter which S3-compatible service I used, file uploads were consistently failing due to CORS (Cross-Origin Resource Sharing) errors. This didn't make much sense because I had CORS set on the S3 bucket to be as permissive as possible.

What was happening was that the app was attempting to make direct PUT requests from the browser, but the preflight checks were failing. I didn't want to spend too much time troubleshooting, but it seemed that there were some compatibility limitations with presigned POST operations. I decided to create an upload proxy to completely bypass CORS and upload the chunks directly to S3.

At the time, I was using [Backblaze B2](https://backblaze.com/b2), and after implementing this change, the uploads started working seamlessly. I also use Storj for my NAS backups so I tried it there as well, which worked like a charm. However, what I didn't want was to incur costs from all of this. Since I already have a server with ample storage space, I decided to setup [MinIO](https://min.io).

## The Challenge

I recently noticed that my MinIO storage was growing rapidly with temporary files that were no longer needed. The project is configured with a cleanup script that triggers GitHub Actions to cleanup the S3 bucket. However, as I have [my instance](https://share.levine.io) protected with [Cloudflare Access](https://www.cloudflare.com/zero-trust/products/access/), it was causing a redirect issue and sending the request to the authentication page. While this likely could've been solved with Cloudflare Access Service Tokens, I decided to take the GitHub Actions workflow entirely out of the equation and instead use a local cleanup script that leverages the MinIO Client (mc).

## Setting up the MinIO Client

First, I needed to install the MinIO Client on my Ubuntu server:

```bash
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
```

After installation, I verified it was working with `mc --version`.

Next, I configured an alias to connect to my MinIO server:

```bash
mc alias set myminio http://localhost:9000 MY_ACCESS_KEY MY_SECRET_KEY
```

A quick test confirmed the connection was working:

```bash
mc ls myminio
```

## Cleanup Script

I needed to create a bash script to handle the cleanup process using `mc`. The following script ended up working just fine:

```bash
#!/bin/bash

# Set variables
MINIO_ENDPOINT="http://localhost:9000"
BUCKET_NAME="my-bucket"
RETENTION_DAYS=7
ACCESS_KEY="my-access-key"
SECRET_KEY="my-secret-key"

# Configure mc client
mc alias remove myminio 2>/dev/null || true
mc alias set myminio $MINIO_ENDPOINT $ACCESS_KEY $SECRET_KEY

# Verify connection and bucket existence
echo "Verifying connection to MinIO server..."
if ! mc ls myminio/$BUCKET_NAME > /dev/null 2>&1; then
  echo "Error: Cannot access bucket. Please check your credentials and bucket name."
  exit 1
fi

# Log start time
echo "Starting MinIO cleanup at $(date)"

# Find and delete files older than retention period
echo "Finding files older than $RETENTION_DAYS days in bucket $BUCKET_NAME..."

# Use mc find to locate and delete old files
mc find myminio/$BUCKET_NAME --older-than "${RETENTION_DAYS}d" --exec "mc rm --force {}"

echo "Cleanup completed at $(date)"
```

I saved it in my $HOME directory and made it executable:

```bash
chmod +x /home/<user>/scripts/minio-cleanup.sh
```

I set the retention period to 7 days because the app is configured by default to retain files for 7 days. This giving recipients ample time to download their files while ensuring my storage doesn't become cluttered with abandoned transfers.

## Permissions Issue

My first attempt at running the script failed with an "Access Denied" error.

![access-denied](https://cdn.levine.io/uploads/portfolio/public/images/blog/access-denied.webp)

I logged into MinIO and checked the access key. After inspecting the policy, I realized I was missing the `s3:DeleteObject` permission. I added it in and ensured the following policy was attached:

```JSON
{
 "Version": "2012-10-17",
 "Statement": [
  {
   "Effect": "Allow",
   "Action": [
    "s3:GetObject",
    "s3:ListBucket",
    "s3:PutObject",
    "s3:DeleteObject"
   ],
   "Resource": [
    "arn:aws:s3:::my-bucket",
    "arn:aws:s3:::my-bucket/*"
   ]
  }
 ]
}
```

I re-ran the script and this time, after removing ~200 files, it completed successfully.

![deletion-success](https://cdn.levine.io/uploads/portfolio/public/images/blog/deletion-success.webp)

## Taking it a Step Further

The only thing I felt was missing at this point was a way for me to find out if the script failed, other than finding out the hard way that I've run out of space. Since I already use [healthchecks.io](https://healthchecks.io) for a lot of my monitoring, it made sense to include this as well.

I created a new check and added it to my crontab:

```plaintext
0 1 * * * /home/<user>/scripts/minio-cleanup.sh && curl -fsS -m 10 --retry 5 -o /dev/null https://hc-ping.com/my-unique-uuid
```

I ran the script for good measure with the curl call to [healthchecks.io](https://healthchecks.io) and it completed successfully as expected.

![cronjob](https://cdn.levine.io/uploads/portfolio/public/images/blog/cronjob.webp)

## Conclusion

Automated file cleanup may seem like a small detail nowadays considering how inexpensive storage is, but it's one of those things that's easy to grow out of control. This is a small quality of life addition that allows me to focus on other things while keeping my MinIO storage in check with zero ongoing effort.
