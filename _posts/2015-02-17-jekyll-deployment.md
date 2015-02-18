---
layout: post
title: Deploying Jekyll with Travis CI
tags: jekyll, ruby, travis, ci

---

I like Jekyll. It's a clean, simple piece of software that makes hosting blogs
painless. I use it for this site, and some others as well. I just built a site
for my girlfriend **(she's an actress in the Baltimore area.
Check [her](http://martharobichaud.com) out if that interests you)**.

When I was building her site, the traditional route would have been to use 
something like Wordpress or some other CMS, as she would need to edit content 
after the fact. Alternatively, I could implement my own CMS for her. I didn't 
like either of these options. I really dislike Wordpress for a number of 
reasons, and I don't have the time to write such a complicated system, as I'm
in my last semester of my bachelor's. Instead, I chose to use Jekyll.

For the most part, Jekyll was fine, aside from the user-friendliness. She's not
a developer, and expecting her to use the command-line would have been absurd.
So here's what I did to get her site up and running.

## Create a Github repo.
There's nothing particularly private on her site, putting everything in a public
Github repo was easiest.

## Deploy with Travis CI.
This website could have been hosted on Github pages, but for particular reasons,
I chose to host her site on Namecheap. This makes the build process more
complicated. On the [Jekyll](http://jekyllrb.com/docs/deployment-methods/) site,
they list a number of ways of deploying. Since I didn't want her to have to
touch any of the tools, I chose to deploy with [Travis CI](http://travis-ci.org).

The setup for this was pretty easy, but I ran into a few problems that might not
be immediately straightforward to solve. First, you need to hook up the repo to
Travis. This is covered in a number of places.

I wanted to upload this site over FTP, and this required using a username and
password. I was immediately worried that this would be sitting in my repo, which
is dangerous! However, Travis is awesome and provides a way of encrypting your
credentials for deployment.

In my case, I needed to include my FTP username and password. After installing
the Travis gem, running the following commands encrypts your keys and stores
them in .travis.yml, allowing you to call them without exposing them:

```sh
travis encrypt --add FTP_USER=ftp_username
travis encrypt --add FTP_PASSWORD=FTP_PASSWORD
```

Within your build instructions, you can call these values by name. I did just
this to deploy the _site directory to the web host.

In the after_success section of .travis.yml, add the following command:

```sh
cd ./_site && find . -type f -exec curl -u $FTP_SUSER:$FTP_PASSWORD \
--ftp-create-dirs -T {} ftp://my_website.com/public_html/{}
```

In case you are unsure, this will change the context to the site directory, find
all files and upload them to the public_html directory of the host using curl.

## Content with Prose.io.
As I said before, my girlfriend is not a technical user. I don't expect her to
open a text editor and use Markdown (though it is quite easy) just to add new
content to her site. Using [Prose.io](http://prose.io), she can easily add
images, blog posts, or any other content, without having to play around with git
commands, text editors, etc.

