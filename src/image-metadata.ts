import exec from "child_process";

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
        return new Promise((resolve, reject) => {
            exec.exec(`exiftool "${this.srcFile}"`,
                (exifErr: exec.ExecException, stdoutText, stderrText ) => {
                    if (!exifErr) {
                        // which exiftool library to use? not sure, just load properties as a dictionary for now
                        const lines = stdoutText.split("\n");
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
                        resolve(metadata);
                    } else {
                        console.log("oops - exif error occurred");

                        console.log(exifErr);
                        console.log(`stderrText=${stderrText}`);
                        throw stderrText;
                    }
                });
        });
    }

    public async addTag(tag: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // exiftool -keywords+=one
            exec.exec(`exiftool -keywords+=${tag} "${this.srcFile}"`,
                (exifErr: exec.ExecException, stdoutText, stderrText) => {
                    if (!exifErr) {
                        //
                        resolve({});
                    } else {
                        console.log("oops - exif error adding tag");
                        console.log(exifErr);
                        console.log(`stderrText=${stderrText}`);
                        throw stderrText;
                    }
            });
        });
    }

    public async deleteTag(tag: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // exiftool -keywords-=one
            exec.exec(`exiftool -keywords-=${tag} "${this.srcFile}"`,
                (exifErr: exec.ExecException, stdoutText, stderrText) => {
                    if (!exifErr) {
                        //
                        resolve({});
                    } else {
                        console.log("oops - exif error deleting tag");
                        console.log(exifErr);
                        console.log(`stderrText=${stderrText}`);
                        throw stderrText;
                    }
            });
        });
    }

    public rateItem(rating: number) {
        // TODO: check for resetting rating..
        if (rating < 0 || rating > 5) {
            console.warn(`invalid rating ${rating}`);
            return;
        }

        const ratingPercent = this.ratingToWindowsPercent[rating];

        // could make this a config for "safety"
        const overwriteOriginal = "-overwrite_original";
        // exiftool -rating=3 -ratingpercent=60 imagepath
        exec.exec(`exiftool ${overwriteOriginal} -rating=${rating} -ratingpercent=${ratingPercent} "${this.srcFile}"`,
            (exifErr: exec.ExecException, stdoutText, stderrText ) => {
                if (!exifErr) {
                    console.log(`rated item? rating=${rating} ratingpercent=${ratingPercent}`);
                    console.log(stdoutText);
                }
            }
        );
    }
}
