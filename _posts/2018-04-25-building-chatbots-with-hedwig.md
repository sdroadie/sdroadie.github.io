---
layout: post
title: "Building chatbots with Hedwig"
tags: [elixir, chatbots]

---

Chatbots are so 2018. I think they were definitely a fad which has seemed to die down. That said,
they're still pretty useful.

I found myself needing to write one. These days, I mostly work in Elixir. So after looking around for
a chatbot framework, I came across [Hedwig](http://github.com/hedwig-im/hedwig). It's an Elixir (check)
chatbot framework (check) with a cool name and logo (check check). I assume it's named after an owl 
from some book I didn't read as a kid.

Taking a look at the documentation, I could see it was a little out-of-date with regards to Elixir
and how supervision trees are used. It took me a bit of time to parse through their docs to get this
running, so I figured I'd do a quick writeup to save myself the confusion again in the future.

## Getting Started
Creating a new project with Hedwig is pretty easy. First, you'll want to create a new Elixir project
with a supervision tree. `mix` makes this simple if you're unfamiliar with how to set this up
yourself.

```
mix new chatbot --sup
```

Next, we'll need to add the Hedwig dependency to our `mix.exs` file.

```
# mix.exs
defmodule Chatbot.MixProject do
  use Mix.Project

  def project do
    [
      app: :chatbot,
      version: "0.1.0",
      elixir: "~> 1.7",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {Chatbot.Application, []}
    ]
  end

  defp deps do
    [
      {:hedwig, "~> 1.0"}
    ]
  end
end
```

Run `mix deps.get` to install Hedwig. Now we can create our chatbot. The skeleton of it, at least.

```
> mix hedwig.gen.robot

Welcome to the Hedwig Robot Generator!

Let's get started.

What would you like to name your bot?: testrobot
Available adapters

1. Hedwig.Adapters.Console
2. Hedwig.Adapters.Test

Please select an adapter: 1
* creating lib/chatbot
* creating lib/chatbot/robot.ex
* updating config/config.exs

Don't forget to add your new robot to your supervision tree
(typically in lib/chatbot.ex):

    worker(Chatbot.Robot, [])
```

This last part is a bit outdated. Instead of using `worker/2`, we're just going to add our chatbot as
a child of our supervision process.

Let's update `lib/chatbot/application.ex` to add our new chatbot to the supervision tree.

```
# lib/chatbot/application.ex
defmodule Chatbot.Application do
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Add your chatbot here.
      {Chatbot.Robot, []}
    ]

    opts = [strategy: :one_for_one, name: Chatbot.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
```

That's all we need to do to get this going. We set up our chatbot to use `Hedwig.Adapters.Console`,
so we can test this without hooking it up to Slack or some other service.

```
> mix run --no-halt

Hedwig Console - press Ctrl+C to exit.

The console adapter is useful for quickly verifying how your
bot will respond based on the current installed responders

>
```

In this prompt, we can test that this thing works. By default, the chatbot generator will have
included `Hedwig.Responders.Help` and `Hedwig.Responders.Ping`. Both of these responders use
`respond/2`, which requires that you identify the chatbot by name. In this case, our chatbot is
called `testrobot`.

```
> testrobot help
testrobot> testrobot help - Displays all of the help commands that testrobot knows about.
testrobot help <query> - Displays all help commands that match <query>.
testrobot: ping - Responds with 'pong'
testrobot test - Echos "Wow" when the user enters "test"

> testrobot ping
testrobot> user: pong
```

Great, it works. Now let's write our own responder.

## Responders

Responders are the part of the Hedwig framework that specify how chatbots interpret and respond to
messages. Let's write a quick "Hello, World!" example.

```
# lib/chatbot/responders/hello_world.ex
defmodule Chatbot.Responders.HelloWorld do
  use Hedwig.Responder

  @usage"""
  hedwig hello - Echos "world" when the user says "hello".
  """
  hear ~r/hello$/i, msg do
    reply msg, "world"
  end
end
```

We can add this to our chatbot in `config/config.exs`.

```
# config/config.exs
use Mix.Config

config :chatbot, Chatbot.Robot,
  adapter: Hedwig.Adapters.Console,
  name: "testrobot",
  aka: "/",
  responders: [
    {Hedwig.Responders.Help, []},
    {Hedwig.Responders.Ping, []},
    {Chatbot.Responders.HelloWorld, []}
  ]
```

The other two responders in the configuration are the defaults Hedwig adds on creation. You can
remove them if you want.

Now, if we run the chatbot again with `mix run --no-halt`, we can test our new commmand.

```
> hello
testrobot> world
> Hello
testrobot> world
> HeLlO
testrobot> world
```

Great! Notice that this command isn't namespaced. What I mean that is we aren't required to specify
what chatbot we want to respond. This is how the `hear/4` macro works. Our chatbots will listen to
any message coming over the wire, and respond when it matches, even if it wasn't addressed to them.

In most cases, we'll want our commands to be addressed. We can fix this with a quick change.

```
# lib/chatbot/responders/hello_world.ex

- hear ~r/hello$/i, msg do
+ respond ~r/hello$/i, msg do
    reply msg, "world"
  end
```

Now, if we run our chatbot, it will only respond to the `hello` command if we say its name first
(`testrobot`, if you forgot).

```sh
> hello
> testrobot hello
testrobot> world
```

That's the basics of creating a chatbot with Hedwig. Next, we'll look at how to manage
conversational state, which is useful if you want users to feel like they're having a conversation
and not sending one-off messages.
