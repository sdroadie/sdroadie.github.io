---
layout: post
title: "Migrating Ecto references without `execute`."
tags: [elixir, ecto]

---

I made a mistake on an Ecto migration, forgetting to add an `on_delete` declaration.
This went unnoticed for a while, until someone in the admin panel of the application
noticed that attempts to delete a certain record kept throwing 500 errors back.

I needed to update the `references` part of the schema, but altering the table with `modify`
would fail since there was an existing constraint. I needed to clear this constraint first.

Most suggestions I saw online to fix this suggested using the `execute` function. While
this will do the trick, I try to avoid using raw SQL as much as possible. Turns out, you
can get the same effect using `drop constraint`.

Assume you have a table called `products` with a foreign key to another table called
`manufacturers`. The constraint might have a name like `products_manufacturers_id_fkey`.
You can remove this in one of (at least) two ways.

First, with `execute`:
```elixir
execute "ALTER TABLE products DROP CONSTRAINT products_manufacturers_id_fkey"
```

But you can do the same with `drop constraint`:
```elixir
drop constraint("products", "products_manufacturers_id_fkey")
```

The second one tripped me up at first, because documentation for `constraint/2` don't have
this kind of repetition between the table and the constraint key.

Hopefully this helps someone else.
