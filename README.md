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

Don`t have the time or resources to host yourself? You can now also just use my prehosted version!
[http://dviide.xyz](http://dviide.xyz)

## Usage

Kahoot tools runs a webserver on port 8080 and a cors server on port 3000. To use kahoot-tools, yarn dev, open a browser and go to localhost:8080.

## Release History

* 4.1.0
    * Implemented custom servers!
    * Implemented themes and option menu!
    * Switched to materialize.
    * Rewrote and wrote a bunch of code!

* 4.0.0
    * Switched to webpack and rewrote a bunch of code!

...older history can be found in the [old](https://github.com/idiidk/kahoot-tools/tree/old) branch

## Goals

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
