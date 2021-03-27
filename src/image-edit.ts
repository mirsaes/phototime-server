// requires imagemagic cli tools to be installed..
import exec from "child_process";

export class ImageEdit {

    public async resize(srcFile: string, destFile: string, width: number) {
        const resizeArg = `-resize ${width}`;
        return new Promise((resolve, reject) => {
            exec.exec(`convert "${srcFile}" ${resizeArg} "${destFile}"`
                , (error: exec.ExecException, stdout: string, stderr: string) => {
                    if (error) {
                        console.log("oops during resize");
                        console.log(error);
                        throw error;
                    }
                    console.log("completing resize of " + srcFile);
                    resolve(stdout);
                });
        });
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
}
