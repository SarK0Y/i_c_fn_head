# i-c-fn-head README

## Features

**Dear Dev, this extension just shows function's name in breadcrumbs of VSCode for C, CPP, D & Rust. Have a nice day, Dear Dev 🤟🙂**
<br>**Valuable Remark:** For now, it's usable for D & Rust.
<br>**Paradigm:** https://alg0z.blogspot.com/2026/03/update-icfnhead.html

## Highlight code.

```json
 "i_c_fn_head.configurations": [
    {
        "paths": [
            "*.d"
        ],
        "rules": [
            {
                "patterns": [
                    "[\\S\\s]+\\([\\S\\s]*\\)[\\S\\s]*?\\{"
                ],
                "color": "Lime"
            },
            {
                "patterns": [
                    "(^|[^a-zA-Z0-9_])int($|[^a-zA-Z0-9_])|\\sint\\s"
                ],
                "color": "Yellow"
            },
            {
                "patterns": [
                    "(^|[^a-zA-Z0-9_])float($|[^a-zA-Z0-9_])|\\sint\\s"
                ],
                "color": "Yellow"
            },
        ]
    }
]

```
