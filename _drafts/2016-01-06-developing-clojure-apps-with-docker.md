---
layout: post
title: Developing Clojure apps with Docker.
category: clojure
tags:
    - clojure
    - docker

---

Looking back at my admittedly sparse blog posts, it's been about a year since I've
started using Clojure. Back then, it was more of a hobby, an interest. These days,
I have the distinct privilege of using it at work. Programming hasn't been this much fun
for me in a long time. Turns out slogging through overly verbose Java or C++ code isn't my
thing. Neither is dealing with the oddities of Javascript.

At work, I'm developing an app using Clojure on the backend, and Clojurescript on the
front end. It's a blast. With tools like Figwheel, development is a joy. However, despite
the great tools in the Clojure ecosystem, there were still some pain points.

We aren't using Datomic, though I wouldn't be against it. My employer is a small lab
at a university, so anytime we can leverage FOSS software to meet our needs, we choose to.
Time travel looks pretty awesome, but it isn't currently necessary with our current models.
We are using PostgreSQL. Which is great for a lot of reasons. However, setting it up on
your local system is kind of gross.

Virtualization solves a lot of problems, so I tried using Virtualbox and Vagrant first.
This was relatively simple to set up. But the performance wasn't acceptable. The JVM would
crash after the system ran out of available memory. So instead of solving that problem,
I opted to use another virtualization system I've wanted to try: Docker.

Docker is great because each part of your application can run in a separate container with
its own resources. This ended up solving my performance issue, I guess. With Postgres
running in its own container, and the JVM running on another, nothing ended up crashing
due to memory limits.

Configuring the app container to communicate with the database container was trivial. The
only part I ran into issues was getting Figwheel to run inside of the app container, but
be accessible from the host machine.
