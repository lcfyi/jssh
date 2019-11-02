[![Netlify Status](https://api.netlify.com/api/v1/badges/ff1e5f00-d1b3-4afc-82ba-afb0fd954c23/deploy-status)](https://app.netlify.com/sites/elastic-bohr-2f351e/deploys)

## Motivation

Playing with `xtermjs` or `hterm` ended up revealing the fact that they're not very optimized for mobile, so I wanted to put something together that's more modern for simple "terminal-like" tasks. Thus, I'm roleplaying as a competent developer who's built a full PTY (term.js) that connects the shell (termprops.js) to the user's display (html, I suppose).

The goal is to create a mobile-friendly web front-end that can run quick functions that I normally used a Python shell for, such as common conversions and quick math.

Also, the roleplay continues with a full CD pipeline using Netlify and Jest.

## Setup

1.  `npm install`
2.  `npm run build`

Output will be in `dist/`. Build runs the tests and packs it if successful. If you want to just pack, you can run `npm run pack`.

You can also take the output of this file and instantiate it in any page; just make sure you have a `#terminal` div (unless you rename it in `index.js`).

## Tests

Tests are in `tests/` using Jest. You can run them with `npm run test`.

## decabyt.es

The terminal is set up in a way where it's extremely easy to add commands in `termProps` (as described below).

## Terminal

Construct a new Terminal with `new Terminal(props)`. The props object is described below.

Terminal has 3 user-facing functions, `init()`, `login()`, and `writeln()`.

### `init()`

Takes the DOM element to attach to as an argument.

### `login()`

No arguments; will print the login message in `termProps.login` before prompting the user for input.

### `writeln()`

Takes a string, or array of strings to print to the terminal. For example, `"demo string"` or `["demo", "string"]`.

Further customization can be done if each string was in an array with the first element as the string, and the second string as the colour to print to the terminal. For example, `["demo string", "red"]` or `[["demo", "red"], ["string", "green"]]`.

This is useful if you want to print things to the terminal before the login prompt. Otherwise, the other prints should be handled in `termProps`.

Additional commands should only use `writeln()` to print to the output.

### `input()`

Takes an optional string parameter that will act as the default prompt string. It returns a promise, which resolves with the user input so you must account for that when designing a function (ie. your function should be async).

## termProps

The heart and soul of the terminal, this object holds all the logic for the terminal. It should have the following properties:

- `terminal` will be automatically initialized by Terminal's constructor
- `prompt` the string appended before the user's input
- `login` a string or array of strings (with layout as described above) for the login message
- `commands` an object with all the commands

## Commands

Each command in the `termProps.commands` object should have `description` and `help` properties, and a `function` method.

The `description` should be a short, simple string, and the `help` property can be as long as you'd like. It is printed with `help [command]`.

The `function` method takes the entire command as the argument, so if it depends on some value after the command (eg. `command [arguments]`), some additional processing has to be done to extract the arguments.

## Contributing

Additional commands should be placed in `/src/plugins`. Each command will have access to the parent props object through `this.parent` (ie. access terminal through `this.parent.terminal`), which is useful for writing lines (`writeln()`) and accepting input (`input()`). Don't forget to also add it as an entry into the `termprops.js` commands property.
