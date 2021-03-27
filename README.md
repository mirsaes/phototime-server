# phototime-server
PhotoTime Server - fun time, photo time, cleaning house, making stuff

PhotoTime is intended to help sort through piles of photos to turn idle time into fun and productive time.
PhotoTime will enable access and modification of photos from a mobile app or your comfortable device.

This includes raw files and the ability to rate, delete, crop, and edit, etc.
The sources for photos are intended to be via various channels, but initial target is via home based computers.

The main goals are to
* make it easier to back up only ok+ photos and discard blurry etc photos
* make it easier to create memory books and other mementos
* keep photos "in-house" 

## History

PhotoTime (client and server) has been non-versioned (privately versioned since 2013) for many years, simmering in incubation.
The server was originally written with CoffeeScript, but in this reincarnation it is ported to TypeScript.

Just searching now in 2020 and see that PhotoTime name was also used by Orbeus and acquired by Amazon for AI purposes around 2016.

# Getting Started
Hiya, lets get started.

We can use Docker a bit later, for now, <b>clone the code</b> and manually install some stuff

## install dependencies
* npm and node
* imagemagick cli

## configuration
* create an appConfig.json to define the servers "repos" and working directories (trash and thumbs, etc)
    * see the sample-appConfig.json
    * recommend specifying the jquery phototime-client webapp but can also just use the "swagger" endpoints

## build and run
```
npm install
npm start
```

## explore
* use a browser to hit your server
    * webapp
        * http://lanip:8080/webapp/
        * must clone code for webapp for now at phototime-client and have mapped in the appConfig.json
    * swagger -> http://lanip:8080/

# Roadmap - ideas
* android app ala [JobHunter](https://play.google.com/store/apps/details?id=com.mirsaes.jobhunter)
* integrate cropping on front-end/backend
  * e.g. https://www.npmjs.com/package/cropperjs
  * when first was looking, considered darkroomjs, but that appears to have lost steam
* and many more
  
# Version History
* 2021.03.13 - WIP adding cropping capability
  * removed node im as just gets in the way
  * added a few wait for it ....
  *       async await usages
* 2020.11.14 - Dockerfile for server, to simplify dependencies
  * arooga
* 2020.11.14 - rate functionality
  * more juice 
* 2020.10.25 - upload [jquery webapp](https://github.com/mirsaes/phototime-client)
  * oh yeah, cue the coolaid
* 2013 and before
  * coffee script fun, wow, has it really been that long?
