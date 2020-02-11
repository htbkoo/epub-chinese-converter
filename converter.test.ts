import * as fs from "fs";
import * as path from "path";
import {createConverterMap, createConverterObj, LangType, SrcPack} from 'tongwen-core';
import * as EPub from "epub";

import {CHAR_DICTIONARY, MERGED_DICTIONARY, PHRASE_DICTIONARY} from "./resources/dictionary";
import {createSimplifiedToTraditionalConverter} from "./converter";

describe("converter", function () {
    it("should convert", async (done) => {
        jest.setTimeout(60000);

        // given
        const converter = createSimplifiedToTraditionalConverter();

        const BOOK_URL = "./resources/book1.epub";
        // var epub = new EPub(epubfile, imagewebroot, chapterwebroot);
        const epub = new EPub(BOOK_URL);

        epub.on("end", function () {
            // epub is now usable

            console.log(`Converting the book - ${epub.metadata.title}`);
            const convertedMetadata = convertMetaData(epub.metadata);

            epub.flow.forEach(chapter => {
                const isMetaChapter = !('title' in chapter && 'order' in chapter);
                if (isMetaChapter) {
                    console.log(`Now at meta chapter - ${chapter.id}`);
                    epub.getChapter(chapter.id, function (err, text) {
                        console.log(text);
                    });
                } else {
                    console.log(`Now at chapter ${chapter.order} - ${chapter.title}`);
                    console.log(chapter);
                    epub.getChapter(chapter.id, function (err, text) {
                        console.log(text);
                    });

                }
            });
        });
        epub.parse();

        function convertMetaData(metadata: object): object {
            return Object.keys(metadata)
                .reduce((obj, key) => {
                    obj[key] = converter.convert(metadata[key]);
                    return obj;
                }, {});
        }

        // when

        // then
        expect(1).toBe(1);
    });

    it("read using fs", () => {
        // const file = (await fs.promises.readFile(path.normalize(BOOK_URL))).toString();
    });
});