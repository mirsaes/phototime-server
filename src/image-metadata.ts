import exec from "child_process";
import { promisify } from "util";

export class ImageMetadata {
    public srcFile: string;

    // windows sets rating percent, sheesh
    // https://exiftool.org/forum/index.php?topic=6591.0
    protected ratingToWindowsPercent = [
        0,  // 0 -> not rated
        1,  // 1 -> 1-12
        25, // 2 -> 13-37
        50, // 3 -> 38-62
        75, // 4 -> 63-87
        99, // 5 -> 88-100
    ];

    constructor(srcFile: string) {
        this.srcFile = srcFile;
    }

    public async readAll(): Promise<any> {
        try {
            const execPromise = promisify(exec.exec);
            const { stdout, stderr } = await execPromise(`exiftool "${this.srcFile}"`);

            if (stderr && stderr.length) {
                console.log("oops - " + stderr);
            }
            const lines = stdout.split("\n");
            const metadata: any = {};
            for (const line of lines) {
                const parts = line.trim().split(":");
                if (parts.length !== 2) {
                    continue;
                }
                const key = parts[0].trim();
                const val = parts[1].trim();
                metadata[key] = val;
            }
            return metadata;
        } catch (e) {
            console.log("error adding metadata tag");
            throw  e;
        }
    }

    public async addTag(tag: string): Promise<string> {
        const cmd = `exiftool -keywords+="${tag}" "${this.srcFile}"`;
        try {
            const execPromise = promisify(exec.exec);
            const { stdout, stderr } = await execPromise(cmd);
            return tag;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async deleteTag(tag: string): Promise<string> {
        // exiftool -keywords-=one
        const cmd = `exiftool -keywords-="${tag}" "${this.srcFile}"`;
        try {
            const execPromise = promisify(exec.exec);
            const { stdout, stderr } = await execPromise(cmd);
            return tag;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async rateItem(rating: number): Promise<number> {
        // TODO: check for resetting rating..
        if (rating < 0 || rating > 5) {
            console.warn(`invalid rating ${rating}`);
            throw new RangeError(`invalid rating ${rating}. must be 0-5 inclusive`);
        }

        const ratingPercent = this.ratingToWindowsPercent[rating];

        // could make this a config for "safety"
        const overwriteOriginal = "-overwrite_original";
        // exiftool -rating=3 -ratingpercent=60 imagepath
        const cmd = `exiftool ${overwriteOriginal} -rating=${rating} -ratingpercent=${ratingPercent} "${this.srcFile}"`;
        try {
            const execPromise = promisify(exec.exec);
            const { stdout, stderr } = await execPromise(cmd);
            return rating;
        } catch (error) {
            throw error;
        }
    }
}
