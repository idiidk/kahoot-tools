# Kahoot Tools
> Scaring teachers since Sep 27, 2017!

A suite of tools for fucking with Kahoot games. Easily installable and customizable.

## Installation

OS X, Linux and Windows:

```sh
git clone https://github.com/idiidk/kahoot-tools.git
cd kahoot-tools
npm install
npm run build
node kahoot-tools.js
```

To run kahoot-tools in dev mode, follow the steps above but replace ```npm run build``` with: ```npm run dev```

## Usage

Kahoot tools runs a webserver on port 80 and a cors server on port 3000. To use kahoot-tools, yarn dev, open a browser and go to localhost:80.

## Release History

* 5.0.0 **(Prerelease)**
    * Implemented 50% of the found exploits
    * Implemented multi player system
    * Improved player join speed by ~500% (yes you read that correctly)
    * Added ability for ghost players to join
    * Added selection for grouped or individual CID`s
    * Added grouped player hacking! (select a player group to affect)

* 4.1.0
    * Implemented custom servers!
    * Implemented themes and option menu!
    * Switched to materialize.
    * Rewrote and wrote a bunch of code!

* 4.0.0
    * Switched to webpack and rewrote a bunch of code!

...older history can be found in the [old](https://github.com/idiidk/kahoot-tools/tree/old) branch

## Goals

### Version 5 (major update)

- [x] Implement multi player system
  * Multiple players per game
  * Custom CID`s
  * Kick on command
- [x] Make players join faster
- [ ] Implement other POC`s on [dviide.xyz/experiments](http://dviide.xyz/experiments)

### Version 4.2 (thanks for the suggestion [@antiburen](https://github.com/antiburen/) !)
- [x] Fully support teams
    * [x] Allow hosting with team names.
    * [x] Make teams work with bots
    * [x] CRAZY NEW HACKS COMING SOON...

### Version 4.1
- [x] Fully implement custom servers.
    * [x] Make a server API for building servers.
    * [x] Make a spot for custom server file hosting.
    * [x] Fully implement themes.

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

## Credit
[@cvgellhorn](https://github.com/cvgellhorn/) - For the webkit boilerplate: [https://github.com/cvgellhorn/webpack-boilerplate](repositiory)
