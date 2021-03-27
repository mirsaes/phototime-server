import express from "express";

export default function(app: express.Application) {
    /**
     * @swagger
     * /repos:
     *  get:
     *      description: checks status of thumb generation
     *      tags:
     *      - Thumbs
     *      - status
     *      produces:
     *      - application/json
     *      responses:
     *          200:
     *              description: check, check, check
     */
    app.get("/status/thumbs", (req, res) => {
        const thumbStatus = app.phototime.getThumbStatus();
        res.json(thumbStatus);
    });

}
