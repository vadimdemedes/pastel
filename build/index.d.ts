export interface Options {
    /**
     * Program name. Defaults to the name of the executable.
     */
    name?: string;
    /**
     * Version. Defaults to version found in the nearest package.json.
     */
    version?: string;
    /**
     * Description. Defaults to description found in the nearest package.json.
     */
    description?: string;
    /**
     * Pass in [`import.meta`](https://nodejs.org/dist/latest/docs/api/esm.html#esm_import_meta). This is used to find the `commands` directory.
     */
    importMeta: ImportMeta;
}
export default class Pastel {
    private options;
    constructor(options: Options);
    run(argv?: string[]): Promise<void>;
}
