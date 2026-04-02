# i-c-fn-head README

## Features

**Dear Dev, this extension just shows function's name in breadcrumbs of VSCode for C, CPP, D & Rust. Have a nice day, Dear Dev 🤟🙂**
<br>**Valuable Remark:** For now, it's usable for D & Rust.
<br>**Paradigm:** https://alg0z.blogspot.com/2026/03/update-icfnhead.html
<br>**How to use:** https://alg0z8n8its9lovely6tricks.blogspot.com/2026/04/how-to-use-icfnhead-for-vscode.html
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
                        "(\\(|\\))"
                    ],
                    "color": "#a0ffff",
                },
                {
                    "patterns": [
                        "\"[\\S\\s]*\""
                    ],
                    "color": "#00ffff",
                },
                {
                    "patterns": [
                        "@(property|safe|trusted|system|disable|nogc)"
                    ],
                    "color": "Pink",
                },
                {
                    "patterns": [
                        "([a-zA-Z0-9_@\\n\\s,_]+\\s*\\()"
                    ],
                    "color": "#ffaa00",
                },
                {
                    "patterns": [
                        "(\\([a-zA-Z0-9_@\\n\\s,_&()/+-.]*\\))"
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
                        "(^|[^a-zA-Z0-9_])(string|auto|bool|byte|ubyte|short|ushort|int|size_t|uint|long|ulong|char|wchar|dchar|float|double|real|ifloat|idouble|ireal|cfloat|cdouble|creal|void|noreturn)($|[^a-zA-Z0-9_])"
                    ],
                    "color": "Yellow"
                },
                {
                    "patterns": [
                        "(^|[^a-zA-Z0-9_])(if|else\\sif|else)($|[^a-zA-Z0-9_])"
                    ],
                    "color": "Blue"
                },
                {
                    "patterns": [
                        "[\\S\\s]+"
                    ],
                    "color": "BrightWhite",
                    "multiLine": true
                },
            ]
        }
    ]
```
