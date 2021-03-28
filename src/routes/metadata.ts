import express from "express";
import { ImageMetadata } from "../image-metadata";
import { RouteUtil } from "./route-util";

export default function(app: express.Application) {
    app.post("/metadata/*", async (req, res) => {
        const {pathUrl, repo} = RouteUtil.extractItemURL(app, "/metadata/", req.url);
        if (!pathUrl || !repo) {
            res.sendStatus(404);
            return;
        }
        const tags = req.body.tags;
        if (tags.length !== 1) {
            res.sendStatus(501);
            return;
        }

        console.log(tags);
        const tag = tags[0];

        const itemId = pathUrl;
        const imageMetadata = new ImageMetadata(itemId);
        try {
            const tagResp = await imageMetadata.addTag(tag);
            res.json(tagResp);
        } catch (ex ) {
            console.log("error");
            res.sendStatus(500);
        }
    });

    app.delete("/metadata/*", async (req, res) => {
        const {pathUrl, repo} = RouteUtil.extractItemURL(app, "/metadata/", req.url);
        if (!pathUrl || !repo) {
            res.sendStatus(404);
            return;
        }

        const tags = req.body.tags;
        if (tags.length !== 1) {
            res.sendStatus(501);
            return;
        }

        const tag = tags[0].trim();
        if (tag.length === 0) {
            res.sendStatus(501);
            return;
        }

        const itemId = pathUrl;
        try {
            const imageMetadata = new ImageMetadata(itemId);
            const deletedTag = await imageMetadata.deleteTag(tag);
            const resp = {
                tagsDeleted: [deletedTag]
            };

            res.json(resp);
        } catch (error) {
            res.sendStatus(500);
        }
        return;
    });

    app.get("/metadata/*", async (req, res) => {
        const {pathUrl, repo} = RouteUtil.extractItemURL(app, "/metadata/", req.url);
        if (!pathUrl || !repo) {
            res.sendStatus(404);
            return;
        }

        const itemId = pathUrl;
        const imageMetadata = new ImageMetadata(itemId);
        try {
            const metadata = await imageMetadata.readAll();
            res.json(metadata);
        } catch (error) {
            res.sendStatus(500);
        }
        return;
    });
}
