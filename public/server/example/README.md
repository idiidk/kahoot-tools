# Custom Servers

## What are custom servers?

Custom servers are Kahoot servers with a little more flair. They allow you to do things that Kahoot normally wouldn`t allow. You can write these servers by editing the files in this directory.

## Are they client side or server side?

They are run client side! This theoretically means Kahoot cannot ban (all of) us!

## That sounds cool but, how do I create them?

Custom servers consist of two parts: 

* The bootstrapper
* The controller

The bootstrapper is located in the bootstrap.js file. It sets up communication between client and server and registers a custom protocol, seperate from the Kahoot one. 

The controller can then be implemented anywhere else in any programming language that supports cometd or sockets (which are a bit harder.) The controller sends custom packets to the server with instructions for the clients.

## What can the clients do?

Because of a vulnerability in the client side code of Kahoot, it is possible to inject javascript. Because of this possibilities are endless! The bootstrap script is the first to usually be injected using the exploit. It sets up a channel for executing remote code in a better way.

## Ok nice, but still, where are the docs?

There are no docs for the server API at the moment. There is however an example server/client implementation in the current code. It registers clients and allows execution of JavaScript code in the clients from a web interface (kahoot-tools.) 

## To summarize

### server/bootstrap.js

Gets injected first. Sets up own communication.

###  server/templates

Contains templates for client views.

### js/server.js

The web controller.

