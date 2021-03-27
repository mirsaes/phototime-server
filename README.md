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

Installation is intended to be via a docker image.

It is easiest to leverage the phototime server and client baked together. See [phototime-client](https://github.com/mirsaes/phototime-client) source on github or [mirsaes/phototime](https://gooogle.com) docker image.

If you would like more control over the server, proceed below.

# Docker Usage
Install docker desktop
Create an appConfig.json file to specify various photo "repos" to serve (see sample-docker-app-config.json)
Create a copy of docker-compose.yml or use as is.
Create .env file to bind data and repo locations
* "Scratch" data directory
  * stores generated thumbs and "trash"
  * PHOTOTIME_DATA_DIR=C:\\phototime\\data
* Application config file
  * declares photo repositories, etc
  * PHOTOTIME_APP_CONFIG_FILE=C:\\phototime\\config\\docker-app-config.json
* Repo location
  * the root location for a photo repo to serve, create entry per repo declared in app config
  * PHOTOTIME_REPO1_DIR=C:\\Users\\Mirsaes\\mypictures
* Web App Client
  * location of web app client that the server will blindly serve
  * PHOTOTIME_WEBAPP_DIR=C:\\phototime\\phototime-client
 
# Explore
* use a browser to hit your server
    * webapp
        * http://lanip:8080/webapp/
        * must clone code for webapp for now at phototime-client and have mapped in the appConfig.json
    * swagger -> http://lanip:8080/
* browse your server from your phone or tablet (lan only)
  * http://lanip:8080/webapp/

# Roadmap - ideas
* android app ala [JobHunter](https://play.google.com/store/apps/details?id=com.mirsaes.jobhunter)
* integrate cropping on front-end/backend
  * e.g. https://www.npmjs.com/package/cropperjs
  * when first was looking, considered darkroomjs, but that appears to have lost steam
* and many more
  
# Version History
* 2021.03.27 - tag
  * WIP tagging capability
  * add or delete tags from jpg images
  * raw support is lagging, but more a matter binding and support xmp side car files
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

# Roughing it
Start by <em>cloning the code</em>.
Then follow below steps.

## install dependencies
* npm and node
* imagemagick cli

## configuration
* create an appConfig.json to define the servers "repos" and working directories (trash and thumbs, etc)
    * see the sample-appConfig.json
    * recommend specifying the jquery phototime-client webapp but can also just use the "swagger" endpoints (or some custom client)

## build and run
```
npm install
npm start
```

