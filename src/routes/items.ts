import express from "express";

// path = require 'path'
export default function(app: express.Application) {
    // 	# item/D:/Pictures/df/df
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

    app.get("/del/item/*", (req, res) => {
        const pathUrl = req.url.replace("/del/item/", "");
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
