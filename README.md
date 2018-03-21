# Kahoot Tools
> Scaring teachers since Sep 27, 2017!

A suite of tools for fucking with Kahoot games. Easily installable and customizable.

## Installation

OS X, Linux and Windows:

```sh
git clone https://github.com/idiidk/kahoot-tools.git
cd kahoot-tools
yarn install
node main.js
```

## Usage

Kahoot tools runs a webserver on port 8080 and a cors server on port 3000. To use kahoot-tools, just start the servers by running main.js with node, open a browser and go to localhost:8080.

## Release History
* 0.3.1
    * Custom servers are documented in the server folder
    * Code refactoring
    * Created server folder and scripts
* 0.3.0
    * Custom Servers (coming very soon)
    * Major redesign!
    * Cleaned up some very nasty code
* 0.2.4
    * Found new 2FA bypass!
* 0.2.3
    * Fixed 2fa screen
    * Fixed connection code when 2fa active
    * Fixed animation lag when crossfading pages
* 0.2.2
    * Fixed some more bugs
    * Streamlined code style
    * Finalized v4 api
* 0.2.0
    * Rewrote whole connection code
    * Added option to answer current question correctly
    * Fixed connections not working on some school networks
* 0.1.8
    * Added 2FA support
    * Added crash option
    * Added bot support
* Before 0.1.8
    * Bug fixes
    * Initial release

## Goals

### Version 4.0
- [ ] Fully implement custom servers.
    * [ ] Make a server API for building servers.
    * [ ] Make a spot for custom server file hosting.

### Version 3.0 (Done)
- [x] Use general code style.
    * [x] Do not use id`s in css.
    * [x] Use same kind of parenthesis.

- [x] Maybe create some new cracks.
    * [x] 2FA bypassing is once again active!

## Meta

idiidk – [@idiidka](https://twitter.com/idiidka)

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/idiidk](https://github.com/idiidk/)

## Contributing

1. Fork it (<https://github.com/idiidk/kahoot-tools/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
