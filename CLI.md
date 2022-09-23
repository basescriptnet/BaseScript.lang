<div align="center">
<p>
    <!--<img width="200" src="https://github.com/basescriptnet/BaseScript.lang/blob/master/logo.jpg?sanitize=true">-->
    <img width="200" src="https://avatars.githubusercontent.com/u/88979822?s=400&u=eb99cb7c07a14d8a61d1724095b689cb260bccfa&v=4">
</p>
<h1>🏗️ BaseScript</h1>

[BaseScript.net](https://BaseScript.net)

<b><img src="https://img.shields.io/badge/version-0.1.45-yellow" alt="version"></b>
</div>

## ℹ️ About

🏗️ BaseScript is a programming language, which aims to compile your code to JavaScript.

This page represents the simple to follow documentation the CLI for the language.

Learn more on GitHub: [BaseScript lang](https://github.com/basescriptnet/BaseScript.lang)

## 🔗 How to contact the creators

📬 Email: [basescriptnet<wbr>@gmail.com](mailto://basescriptnet@gmail.com)<br>
✈️ Telegram: [@basescript](t.me/basescript)<br>
📹 YouTube: [BaseScript Channel](https://www.youtube.com/channel/UCmNoL3N13lRHbcGYT8vr6lA)

## ▶️ Getting started

> Install via npm

```sh
npm i basescript.js -g
```

> At any directory use

```sh
bsc -f "<file_name>"
```

> To alternatively run the cli

```sh
node cli --file "<file_name>" [--run?]
```

> Specify the output file

```sh
bsc -f "<file_name>" -o "<output_file_name>"
```

> For help use

```sh
bsc -h
# or
bsc --help
```

> Save to file, and then run from CLI

```sh
bsc -f "<file_name>" -r
```

## 📝 Options

<pre>
<ul>
<li>-h or --help    | Used for help                 [Boolean]</li>
<li>-v or --version | Get version                   [Boolean]</li>
<li>-f or --file    | Specify the input file        [String]</li>
<li>-o or --out     | Specify the output file       [String]</li>
<li>-e or --env     | Specify as executable of Node [Boolean]</li>
<li>-w or --watch   | Watch file                    [Boolean]</li>
<li>-r or --run     | Save and run the file         [Boolean]</li>
</ul>
</pre>
