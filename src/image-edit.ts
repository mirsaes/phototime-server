// requires imagemagic cli tools to be installed..
import exec from "child_process";
import { promisify } from "util";
import { Util } from "./util";

export class ImageEdit {

    public async resize(srcFile: string, destFile: string, width: number) {

        if (Util.isRaw(srcFile)) {
            return this.resizeRaw(srcFile, destFile, width);
        }

        const resizeArg = `-resize ${width}`;

        const execPromise = promisify(exec.exec);
        const cmd = `convert "${srcFile}" ${resizeArg} "${destFile}"`;
        try {
            const { stdout, stderr } = await execPromise(cmd);
            return stdout;
        } catch (error) {
            console.log("error");
            throw error;
        }
    }

    public async crop(srcFile: string, destFile: string, x: number, y: number, width: number, height: number) {
        let isRaw = false;
        const ext = srcFile.split(".")[-1];

        if (ext in [".cr2", ".CR2"]) {
            console.log("raw file");
            isRaw = true;
        }

        if (isRaw) {
            // use dcraw
        } else {
            // use image magick
            // convert '*.jpg' -crop 120x120+10+5 thumbnail%03d.png
            return new Promise((resolve, reject) => {
                const cropArg = `-crop ${width}x${height}+${x}+${y}`;

                exec.exec(`convert "${srcFile}" ${cropArg} "${destFile}"`
                 , (error: exec.ExecException, stdout: string, stderr: string) => {
                    if (error) {
                        console.log("oops");
                        console.log(error);
                        throw error;
                    }

                    console.log("ok, cropped");
                    console.log(stdout);
                    const cropResponse: any = {};
                    resolve(cropResponse);
                });
            });
        }
    }

    private async resizeRaw(srcFile: string, destFile: string, width: number) {
        /*
        raw stuff
        # extract thumbnail
        dcraw -e <filename>
        # extract image
        dcraw <filename>
        generates either jpg or PPM

        if ppm can convert with "convert <filename>.ppm <filename>.jpg"
        */
        // could convert to jpg then resize or just extract thumb which might not be the right size
        // for now, just extract the thumb until it doesn't work
        console.log("resize raw");
        const execPromise = promisify(exec.exec);

        const cmd = `dcraw -e -O "${destFile}" "${srcFile}"`;

        try {
            const { stdout, stderr } = await execPromise(cmd);
        } catch (error) {
            throw error;
        }
    }
}
