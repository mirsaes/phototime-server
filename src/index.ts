import express from "express";

import fs from "fs";
import path from "path";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// https://stackoverflow.com/questions/45077585/how-to-parse-commandline-args-with-yargs-in-typescript
// https://medium.com/@shrikantsonone/simple-todo-cli-in-nodejs-with-typescript-bab732174996
import * as yargs from "yargs";
import { LaunchConfig } from "./launch-config";
import { Phototime } from "./phototime";
import { PhototimeConfig } from "./phototime-config";
import { RepoDefinition } from "./repo-definition";

import * as routes from "./routes/routes";

const portOption: yargs.Options = {
    default: 8080,
    describe: "Port to use",
    type: "number"
};

const hostOption: yargs.Options = {
    default: "localhost",
    describe: "host to bind to (localhost or 0.0.0.0)",
    type: "string"
};

const appConfigOption: yargs.Options = {
    default: "./appConfig.json",
    describe: "app config location"
};

const argv = yargs.command("$0", "Start the server",
    {
        appConfig: appConfigOption,
        host: hostOption,
        port: portOption
    }).argv;

// tslint:disable:object-literal-sort-keys
const swaggerOptions = {
    swaggerDefinition: {
      // Like the one described here: https://swagger.io/specification/#infoObject
      info: {
        description: "Test phototime API with autogenerated swagger doc",
        title: "Phototime API",
        version: "1.0.0"
      }
    },
    // List of files to be processed. You can also set globs './routes/*.js'
    apis: ["dist/index.js", "dist/routes/*.js"]
  };
// tslint:enable:object-literal-sort-keys

const specs = swaggerJsDoc(swaggerOptions);

// TODO: declare subclass that has own typed data and functions for app
const app = express();
app.use(express.json());
routes.loadRoutes(app);

const port = Number(argv.port); // 8080; // default port to listen
const host = "" + argv.host;

// load config
// TODO: make config into class?
// read the first arg to get the config from command line
// e.g. coffee photoTime.coffee config.mptosh.json
// if supply a directory it will bomb
let appConfigFileName: string = "./appConfig.json";
if (argv.appConfig) {
    appConfigFileName = "" + argv.appConfig;
}

console.log("appConfigFileName='" + appConfigFileName + "'");

const appConfigJSON: string = fs.readFileSync(appConfigFileName, "utf8");
const appConfig: LaunchConfig = JSON.parse(appConfigJSON);

console.log(appConfig);

declare global {
    namespace Express {
        export interface Application {
            phototime: Phototime;
        }
    }
}
const EXTENSIONS =	[".jpg", ".JPG", ".jpeg", ".CR2", ".CRW", ".NEF"];
const RAWEXTENSIONS = [".CR2", ".CRW", ".NEF"];

// runtime config
const photoTimeConfig = new PhototimeConfig(
    appConfig.root,
    path.join(appConfig.root, appConfig.thumbs),
    path.join(appConfig.root, appConfig.trash),
    // appConfig.extensions || EXTENSIONS,
    EXTENSIONS,
    RAWEXTENSIONS,
    // repos:appConfig.repos,
    process.cwd(),
    path.join(appConfig.root, "tmp")
);
app.phototime = new Phototime(photoTimeConfig, appConfig);

console.log("thumbdir =" + app.phototime.getConfig().thumbs);

// define a route handler for the default home page
/**
 * @swagger
 * /:
 *    get:
 *      description: sample home page entry point
 */
app.get( "/", ( req, res ) => {
    let resText: string = "<html><body>Hello, please navigate to the following";
    resText += "<ul>";
    resText += '<li><a href="/webapp">/webapp</a></li>';
    resText += '<li><a href="/api-docs">/api-docs</a></li>';
    resText += "</ul></body></html>";
    res.end( resText );
} );

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// optionally bind the webapp as static
// app.use("/webapp", express.static("C:/Coding/bb/mega/photoTime/webapp/jQueryMobile"));
if (appConfig.webapp) {
    app.use("/webapp", express.static(appConfig.webapp));
}

// serve the generated thumbnails
app.use("/thumbs", express.static(app.phototime.config.thumbs));

// start the Express server
app.listen( port, host, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://${host}:${ port }` );
} );

/*
    FoggyBridge (homecloud)
    homecloud
    VBox/Docker for *
    homecloud/apps/phototime-server/shared/
        map host->docker-machine->docker
    homecloud/apps/phototime-server/config/

    File Storage is complimentary to database storage
    apps can use sqllite or mysql as appropriate

    Install HomeCloud
        identify primary storage location for settings/etc
        Windows
            C:\homecloud
        docker-machine
            /homecloud
        docker (homecloud-admin)
            /homecloud?

    Install phototime-server
        associate storage location for app specific configs?

        Windows
            C:\homecloud\apps\phototime-server\
        docker-machine
            /homecloud/apps/phototime-server/app
        docker (phototime-server)
            /homecloud/apps/phototime-server -> /phototime-server???

    Add a repository (app specific function)
        This app would like read/write access to the following location?
        Windows
            C:\Users\Michael\Pictures
        docker-machine
            /homecloud/apps/phototime-server/shared/pictures

        // when launch "app" will add volume mounts
        docker (phototime-server)
            /homecloud/shared/pictures

            app.addRepo("My Pictures", )
                /phototime-server/config/repos.json

Data to store
Data to read/write
    TODOS:

routes
    * /image/*.jpg
    app.get '/image/*.jpg'

    home
    items
    repos
    thumbs
    index? - just used for adding all routes
*/
