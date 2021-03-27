import express from "express";
import { ImageMetadata } from "../image-metadata";

export default function(app: express.Application) {
    app.post("/metadata/*", (req, res) => {
        const itemId = decodeURIComponent(req.url.replace("/metadata/", "")).split("?")[0];
        console.log(`modify metadata url=${itemId}`);

        const tags = req.body.tags;
        if (tags.length !== 1) {
            res.send("501");
            return;
        }

        console.log(tags);
        const tag = tags[0];

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
        imageMetadata.addTag(tag).then((metadata) => {
            const resp = {
                tags: "tag added"
            };
            res.json(metadata);
        }).catch((reason) => {
            res.send("500");
        });
    });

    app.delete("/metadata/*", (req, res) => {
        const itemId = decodeURIComponent(req.url.replace("/metadata/", "")).split("?")[0];
        console.log(`del tag url=${itemId}`);
        // can this ever happen?
        if (itemId.indexOf("..") !== -1) {
            res.send("404");
        }

        const tags = req.body.tags;
        if (tags.length !== 1) {
            res.send("501");
            return;
        }

        const tag = tags[0].trim();
        if (tag.length === 0) {
            res.send("501");
            return;
        }
        const cachedRepos = app.phototime.getCachedRepos();
        const repo = app.phototime.getParentRepo(itemId);
        if (!repo) {
            res.send("404");
        }

        const imageMetadata = new ImageMetadata(itemId);
        imageMetadata.deleteTag(tag).then((metadata) => {
            const resp = {
                tags: "tag deleted"
            };
            res.json(metadata);
        }).catch((reason) => {
            res.send("500");
        });

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
}
