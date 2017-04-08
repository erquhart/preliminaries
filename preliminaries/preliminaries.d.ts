declare module "preliminaries" {
    export interface PreliminariesOptions {
        parser?: PreliminariesParser;
        lang?: string;
        delims: string | string[];
        stringifyLang: boolean;
        stringifyUseParserDelims: boolean;
    }

    export interface PreliminariesParser {
        (autoRegister: boolean): PreliminariesParser;
        parse(str: string, options?: PreliminariesOptions): any;
        stringify(data: Object, options?: PreliminariesOptions): string;
        delims: string | string[];
    }

    export interface Preliminaries {
        (autoRegister: boolean): Preliminaries;
        parse(str: string, options?: PreliminariesOptions): any;
        stringify(str: string, data: Object, options?: PreliminariesOptions): string;
        registerParser(lang: string, parser: PreliminariesParser): void;
        unregisterParser(lang: string): void;
        jsonParser: PreliminariesParser; 
    }

    var preliminaries: Preliminaries;
    export default preliminaries;
}
