---
published: false
layout: post
category: programming
tags: 
  - clojure
  - compojure
  - JSON
---


## Lessons about Compojure and Clojure

I recently had the opportunity to migrate a codebase for a work project from NodeJS and React to Clojure and Clojurescript. I've been trying to pick up Clojure for months now, but I find it difficult without a solid project. Since I started porting our code over, I feel that I'm understanding how to do things in this system at an impressive rate.

That being said, I've hit a few issues along the way that I'd like to document, both for myself and for others. Some of these are specific to my tech stack, while others are likely general web stuff.

### Put your 404 handler last. Always.
I spent the better part of an hour trying to figure out why I could access my index page, but not anything deeper in the app. Everything kept coming up as a 404. And not a Ring 404 page.

My code looked a bit like this.

#### some-api.clj
```clojure
(ns app.some-api
	(:require [compojure.core :refer :all]
    		  [compojure.route :as route]
              [compojure.handler :as handler]))
              
(defroutes some-routes
	(GET "/stuff" [] {:apples 2 :oranges 3}))
    
(def some-api
	(handler/api some-routes))
```

#### interface.clj
```clojure
(ns app.interface
	(:require [compojure.core :refer :all]
    		  [compojure.route :as route]
              [compojure.handler :as handler]))
              
(defroutes interface-routes
	(GET "/" [] "Hello World!")
    (route/not-found "Not Found"))
    
(def interface
	(handler/site interface-routes))
```

#### handler.clj
```clojure
(ns app.handler
	(:require [compojure.core :refer :all]
    		  [compojure.route :as route]
              [app.some-api :refer [some-api]]
              [app.interface :refer [interface]]))
              
 (def app
 	(routes interface some-routes))
```

The issue here is subtle, but obvious to the experienced developer. The 404 route is being injected into the app after the index route, but before anything else. Because routes are checked in sequence, the server checks index, fails, moves on to the 404 route, which acts as a catch-all. The fix is simple.

#### handler.clj (FIXED)
```clojure
(ns app.handler
...
(def app
	(routes some-routes interface))
```

### Handling raw POST data with Compojure.
I'm pretty new to Clojure. I've only been using it at work for about two weeks. It's been a pleasant learning curve - the codebase looks quite a bit better, and is also much easier to reason about.

I ran into one issue with getting raw POST data from a request using Compojure. I'm not familiar with the system yet, so I try to get something to work, then look it up on StackOverflow or something.

Looking at the docs for Compojure, it seemed that the proper way of getting the data from a request is to get the `:params` map from the request. However, due to passing raw data (I'm using [Postman](https://www.getpostman.com/) to test), this map was empty - everything was in the `:body` map. It's trivial to get the data out of this.

#### Example
```clojure
(POST "some-route" {body :body}
      (-> (slurp body) (do-stuff)))
```

I'll add other bits of knowledge and wisdom as I run into them. But that's all for now.