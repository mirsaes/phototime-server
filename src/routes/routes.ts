import express from "express";
import fs from "fs";

import image_edit_route from "./imageEdit";
import items_route from "./items";
import repos_route from "./repos";

export function loadRoutes(app: express.Application) {
    repos_route(app);
    items_route(app);
    image_edit_route(app);

    /*
    fs.readdirSync(__dirname).forEach((file) => {
        if (file === "routes.js") {
            return;
        }
        const extIdx = file.lastIndexOf(".");

        const name = file.substr(0, extIdx);
        const ext = file.substr(extIdx);

        if (ext !== ".js") {
            console.log("skipping:" + file);
            return;
        }
        // node require route.. assuming dirname is routes
        // require("./" + name)(app);
        // import name from `./{name}`;
        console.log("TODO: import / wire route for " + "./" + name);
        // each route file should export default so can just call it?

    });
    */

}
