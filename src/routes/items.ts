import express from "express";
import { ImageMetadata } from "../image-metadata";

// path = require 'path'
export default function(app: express.Application) {
    // 	# item/D:/Pictures/df/df
    /**
     * @swagger
     * /item/{itemid}:
     *  get:
     *      description: get ccontents of repo or some subpath of repo
     *      tags:
     *      - Items
     *      parameters:
     *          - in: path
     *            name: itemid
     *            required: true
     *            description: the item id, i.e. the repo id plus the item path (id)
     *      produces:
     *        - application/json
     *      responses:
     *          200:
     *              description: carrickfergus
     */
    app.get("/item/*", (req, res) => {
        let pathUrl = req.url.replace("/item/", "");
        pathUrl = decodeURIComponent(pathUrl);
        console.log("pathUrl=" + pathUrl);
        // can this ever happen?
        if (pathUrl.indexOf("..") !== -1) {
            res.send("404");
        }
        // verify pathUrl is one of the repos
        console.log("TODO: verify pathUrl starts with one of the repos");
        // ensure repos are cached
        const cachedRepos = app.phototime.getCachedRepos();
        pathUrl = pathUrl.split("?")[0];
        const repo = app.phototime.getParentRepo(pathUrl);
        if (!repo) {
            res.send("404");
        }
        const resItem: any = {};

        resItem.info = app.phototime.getItemInfo(repo, pathUrl);
        // if not a directory, ignore it
        try {
            resItem.items = app.phototime.getRepoItems(pathUrl);
        } catch (ex) {
            console.log("not a dir?" + ex);
        }

        res.json(resItem);
        // res.send '404'
    });

    /**
     * @swagger
     * /item/{itemid}:
     *  post:
     *      description: modify contents of repo item, e.g. rating.
     *      tags:
     *      - Items
     *      parameters:
     *          - in: path
     *            name: itemid
     *            required: true
     *            description: the item id, i.e. the repo id plus the item path (id)
     *          - in: body
     *            name: rating
     *            required: false
     *            description: the rating to apply or if not specified, to remove
     *      produces:
     *        - application/json
     *      responses:
     *          200:
     *              description: carrickfergus
     */
    app.post("/item/*", (req, res) => {
        // could make this a rating endpoint instead?
        const itemId = decodeURIComponent(req.url.replace("/item/", "")).split("?")[0];
        // can this ever happen?
        if (itemId.indexOf("..") !== -1) {
            res.send("404");
        }

        // ensure repos are cached
        const cachedRepos = app.phototime.getCachedRepos();
        const repo = app.phototime.getParentRepo(itemId);
        if (!repo) {
            res.send("404");
        }
        const resItem: any = {};

        app.phototime.rateItem(repo, itemId, req.body.rating);
        res.send("200");
    });

    app.get("/metadata/*", (req, res) => {
        const itemId = decodeURIComponent(req.url.replace("/metadata/", "")).split("?")[0];
        // can this ever happen?
        if (itemId.indexOf("..") !== -1) {
            res.send("404");
        }
        const cachedRepos = app.phototime.getCachedRepos();
        const repo = app.phototime.getParentRepo(itemId);
        if (!repo) {
            res.send("404");
        }

        const imageMetadata = new ImageMetadata(itemId);
        imageMetadata.readAll().then((metadata) => {
            res.json(metadata);
        }).catch((reason) => {
            res.send("500");
        });
    });

    /**
     * @swagger
     * /item/{itemid}:
     *  delete:
     *      description: delete the item (i.e. move to trash)
     *      tags:
     *      - Items
     *      parameters:
     *          - in: path
     *            name: itemid
     *            required: true
     *            description: the item id, i.e. the repo id plus the item path (id)
     *      produces:
     *        - application/json
     *      responses:
     *          200:
     *              description: moonlight
     */
    app.delete("/item/*", (req, res) => {
        const pathUrl = decodeURIComponent(req.url.replace("/item/", ""));
        console.log("del req url=" + pathUrl);
        console.log ("pathUrl=" + pathUrl);
        // can this ever happen?
        if (pathUrl.indexOf("..") !== -1) {
            res.send("404");
        }
        // verify pathUrl is one of the repos
        console.log("TODO: verify pathUrl starts with one of the repos");
        // ensure repos are cached
        const cachedRepos = app.phototime.getCachedRepos();

        const pathUrlOnly = pathUrl.split("?")[0];
        const repo = app.phototime.getParentRepo(pathUrlOnly);
        if (!repo) {
            res.send("404");
        }

        const resItem: any = {};
        console.log("delete for: " + pathUrlOnly);
        // move to 'trash'
        app.phototime.moveToTrash(pathUrlOnly);
        res.send("200");
    });

}
