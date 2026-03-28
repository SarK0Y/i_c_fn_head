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
                        "@(property|safe|trusted|system|disable|nogc)"
                    ],
                    "color": "Pink",
                },
                {
                    "patterns": [
                        "(\\([a-zA-Z0-9_@\\n\\s,_]*\\))"
                    ],
                    "color": "Cyan",
                    "multiLine": true
                },
                {
                    "patterns": [
                        "[a-zA-Z0-9_@\\n\\s]+(\\([a-zA-Z0-9_@\\n\\s]*?\\))+[\\s\\n]*\\{"
                    ],
                    "color": "Lime",
                    "multiLine": true
                },
                {
                    "patterns": [
                        "(^|[^a-zA-Z0-9_])(auto|bool|byte|ubyte|short|ushort|int|uint|long|ulong|char|wchar|dchar|float|double|real|ifloat|idouble|ireal|cfloat|cdouble|creal|void|noreturn)($|[^a-zA-Z0-9_])"
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
