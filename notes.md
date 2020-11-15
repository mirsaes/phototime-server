# Setup

A bunch of raw notes below, apologize for the mess.

https://developer.okta.com/blog/2018/11/15/node-express-typescript

```
  mkdir phototime-server
  node --version
  cd phototime-server/
  npm init -y
  vim package.json
  npm install --save express
  mkdir src
  npm install --save-dev typescript
  vim tsconfig.json
  npm install --save-dev tslint
  npm install --save-dev @types/node @types/express
```
```
  npm install yargs
  npm install --save-dev @types/yargs
  #consider dotenv
  npm install dotenv
  npm install --save-dev @types/dotenv
```

```
  #openapi
  #http://www.acuriousanimal.com/2018/10/20/express-swagger-doc.html
  npm install swagger-ui-express
  npm install --save-dev @types/swagger-ui-express

  npm install swagger-jsdoc
  npm install --save-dev @types/swagger-jsdoc

  #https://github.com/Surnet/swagger-jsdoc/tree/master/example/v2
```

```
  npm install imagemagick
  npm install --save @types/imagemagick

  npm install mkdirp
  npm install --save @types/mkdirp
```

CREATING DOCKERFILE
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/


# running local

`npm start`

will likely complain about missing configuration

so specify local appConfig.json

`npm start -- --appConfig=/c/coding/git/phototime-server/appConfig.json`

# running via docker

work in progress
idea is to bind mount directories available such as
the webapp client
the config
the repos

```
 docker build -t mirsaes/phototime-server .
 
 docker run --rm -d -p 8080:8080 \
 --mount type=bind,source="/full/path/for/runtime/data",target="/phototime-data" \
 --mount type=bind,source="/full/path/to/dir/with/images",target="/phototime-repos/repo1" \
 --mount type=bind,source="/full/path/to/phototime-client/webapp",target="/phototime-client" \
 --mount type=bind,source="/full/path/to/phototime-server/app/docker/config.json",target="/usr/src/phototime-server/appConfig.json" \
 --name phototime mirsaes/phototime-server
```

# External Dependencies
* ImageMagick
  * ImageMagick 6.9.2-8 (64 bit)
* exiftool
  * https://exiftool.org/
* dcraw

