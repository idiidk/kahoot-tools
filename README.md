# Kahoot Tools
> Scaring teachers since Sep 27, 2017!

A suite of tools for fucking with Kahoot games. Easily installable and customizable.

## Installation

OS X, Linux and Windows:

```sh
git clone https://github.com/idiidk/kahoot-tools.git
cd kahoot-tools
npm install
# Edit config.json
npm run build
node kahoot-tools.js
```

To run kahoot-tools in dev mode, follow the steps above but replace ```npm run build``` with: ```npm run dev```

Can't host yourself? You can now also just use [@SimDoes](https://github.com/simdoes)'s prehosted version!
--> [bot.omegaboot.com](https://bot.omegaboot.com)

## Usage

Kahoot tools runs a webserver on port 8080 and a cors server on port 3000. To use kahoot-tools, yarn dev, open a browser and go to localhost:8080.

## Release History

* 5.1.0 **Xenon Release**
    * Preparing for future updates
    * Removed server code

* 5.0.0 **(Prerelease)**
    * Implemented 50% of the found exploits
    * Implemented multi player system
    * Improved player join speed by ~500% (yes you read that correctly)
    * Added ability for ghost players to join
    * Added selection for grouped or individual CID`s
    * Added grouped player hacking! (select a player group to affect)

...older history can be found in the [old](https://github.com/idiidk/kahoot-tools/tree/old) branch and the [pre-xenon](https://github.com/idiidk/kahoot-tools/tree/pre-xenon) branch

## Goals

### Xenon Release
  - [ ] To be decided

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
[@cvgellhorn](https://github.com/cvgellhorn/) - For the webpack boilerplate: [https://github.com/cvgellhorn/webpack-boilerplate](repositiory)
