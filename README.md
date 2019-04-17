# Motivation

Originally, I wanted to build a kitchen sink with a terminal emulator using `xtermjs` or `hterm`, but that ended up having poor mobile support. Thus, to avoid re-inventing the wheel, I fellback to just using simple HTML elements to emulate a terminal. 

The kitchen sink aspecet is to support common functions that I used a Python shell for, such as common conversions and quick math.

It supports mobile. 

# Setup

1.  `npm install`
2.  `npm run build`

Output will be in `dist/`

# decabyt.es

The terminal is set up in a way where it's extremely easy to add commands in `termProps` (as described below). 

# waTerminal

Construct a new waTerminal with `new waTerminal(props)`. The props object is described below.

waTerminal has 3 user-facing functions, `init()`, `login()`, and `writeln()`. 

### `init()` 

Takes the DOM element to attach to as an argument.

### `login()`

No arguments; will print the login message in `termProps.login` before prompting the user for input.

### `writeln()`

Takes a string, or array of strings to print to the terminal. For example, `"demo string"` or `["demo", "string"]`.

Further customization can be done if each string was in an array with the first element as the string, and the second string as the colour to print to the terminal. For example, `["demo string", "red"]` or `[["demo", "red"], ["string", "green"]]`.

This is useful if you want to print things to the terminal before the login prompt. Otherwise, the other prints should be handled in `termProps`.


# termProps

The heart and soul of the terminal, this object holds all the logic for the terminal. It should have the following properties:

- `terminal` - will be automatically initialized by waTerminal's constructor
- `prompt` - the string appended before the user's input
- `login` - a string or array of strings (with layout as described above) for the login message
- `commands` - an object with all the commands

## Commands

Each command in the `termProps.commands` object should have `description` and `help` properties, and a `function` method.

The `description` should be a short, simple string, and the `help` property can be as long as you'd like. It is printed with `help [command]`.

The `function` method takes the entire command as the argument, so if it depends on some value after the command (eg. `command [arguments]`), some additional processing has to be done to extract the arguments.