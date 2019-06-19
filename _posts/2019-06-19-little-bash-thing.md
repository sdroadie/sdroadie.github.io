---
layout: post
title: "Little bash thing I learned."
tags: [bash]

---

I never learned `bash` all that well because I never really needed to. By
the time I was digging into a lot of command-line stuff, projects like
[oh-my-zsh](https://ohmyz.sh/) were fairly popular, so a lot of command-line
stuff was already around for me.

I've learned and forgotten bits of `sed` and `awk` here and there. They're useful,
but often more trouble for me to use and remember than it is to learn on other tools.

That said, I do try to add little aliases here and there for myself. I've been trying
to keep on top of my daily work by logging things. I use a pretty simple format for my
log file names: YYYY-MM-DD.md. I also use tmux heavily.

When I initially wrote my `log` alias, it looked like this:
```sh
alias log=vim `date +%Y-m-d`.md
```

This worked pretty well at first. But I started to notice an issue when running this alias
in a tmux session that was a few days old. The date on the file would be wrong. It would
be set to the date that the tmux session started, not when I ran the command.

To fix this, I changed the alias to 
```sh
alias log=vim $(date +%Y-%m-%d).md
```

I don't really know the
difference between the two expansions, but I've only really leaned on them at runtime. This might
be obvious to someone who knows how bash works, but it was interesting to me.
