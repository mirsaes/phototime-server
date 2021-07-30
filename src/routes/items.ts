import express from "express";
import { RouteUtil } from "./route-util";

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
        const {pathUrl, repo } = RouteUtil.extractItemURL(app, "/item/", req.url);
        if (!pathUrl || !repo) {
            res.sendStatus(404);
            return;
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
        const {pathUrl, repo } = RouteUtil.extractItemURL(app, "/item/", req.url);
        if (!pathUrl || !repo) {
            console.log("rating failed");
            res.sendStatus(404);
            return;
        }

        const resItem: any = {};

        app.phototime.rateItem(repo, pathUrl, req.body.rating);
        res.status(200).contentType("application/json").send(resItem);
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
        const {pathUrl, repo } = RouteUtil.extractItemURL(app, "/item/", req.url);
        if (!pathUrl || !repo) {
            res.sendStatus(404);
            return;
        }

        const resItem: any = {};
        console.log("delete for: " + pathUrl);
        // move to 'trash'
        app.phototime.moveToTrash(pathUrl);
        res.sendStatus(200);
    });

}
