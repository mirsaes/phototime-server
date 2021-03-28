import express from "express";
import { RouteUtil } from "./route-util";

export default function(app: express.Application) {
    /**
     * @swagger
     * /imageedit/crop:
     *  get:
     *      description: returns list of repos configured on this server
     *      tags:
     *      - Repos
     *      produces:
     *      - application/json
     *      responses:
     *          200:
     *              description: repos blah
     */
    app.put("/imageedit/crop/*", async (req, res) => {
        const {pathUrl, repo} = RouteUtil.extractItemURL(app, "/imageedit/crop/", req.url);
        if (!pathUrl || !repo) {
            res.sendStatus(404);
            return;
        }

        const resItem: any = {};
        console.log("get item info..");
        const preCropItemInfo = app.phototime.getItemInfo(repo, pathUrl);
        console.log(preCropItemInfo);

        // if not a file, ignore it
        if ("file" !== preCropItemInfo.type) {
            res.sendStatus(404);
        }
        try {
            const cropParams = {
                x: req.body.detail.x,
                y: req.body.detail.y,
                width: req.body.detail.width,
                height: req.body.detail.height
            };

            await app.phototime.cropImage(preCropItemInfo.id, cropParams);
            console.log("done waiting for crop");
            resItem.items = app.phototime.getRepoItems(pathUrl);
        } catch (ex) {
            console.log("not a dir?" + ex);
        }
        res.json(resItem);
    });

}
