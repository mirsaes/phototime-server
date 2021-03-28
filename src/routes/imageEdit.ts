import express from "express";

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
        const pathUrl = decodeURIComponent(req.url.replace("/imageedit/crop/", "")).split("?")[0];
        // can this ever happen?
        if (pathUrl.indexOf("..") !== -1) {
            res.send("404");
        }
        // verify pathUrl is one of the repos
        console.log("TODO: verify pathUrl starts with one of the repos");
        // ensure repos are cached
        const cachedRepos = app.phototime.getCachedRepos();
        const repo = app.phototime.getParentRepo(pathUrl);
        if (!repo) {
            res.send("404");
        }

        const resItem: any = {};
        console.log("get item info..");
        const preCropItemInfo = app.phototime.getItemInfo(repo, pathUrl);
        console.log(preCropItemInfo);

        // if not a file, ignore it
        if ("file" !== preCropItemInfo.type) {
            res.send("404");
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
