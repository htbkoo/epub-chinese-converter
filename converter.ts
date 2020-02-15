import {createConverterMap, LangType, SrcPack} from 'tongwen-core';
import * as EPub from "epub";
import {Converter} from "tongwen-core/esm/converter/types";

import {CHAR_DICTIONARY, PHRASE_DICTIONARY} from "./resources/dictionary";

interface SimplifiedToTraditionalConverter {
    convert: (text: string) => string;
    converter: Converter
}

interface ConvertedBook {
    metadata;
    book;
}

export function createSimplifiedToTraditionalConverter(): SimplifiedToTraditionalConverter {
    const dics: SrcPack = {s2t: [CHAR_DICTIONARY, PHRASE_DICTIONARY], t2s: []};
    const converter = createConverterMap(dics);

    return {
        convert(text: string) {
            return converter.phrase(LangType.s2t, text);
        },
        converter
    }
}

export function epubConverter(path: string) {
    const epub = new EPub(path);

    return {
        async convert(converter: SimplifiedToTraditionalConverter): Promise<ConvertedBook> {
            return new Promise(resolve => {
                epub.on("end", function () {
                    // epub is now usable
                    console.log(`Converting the book - ${epub.metadata.title}`);
                    const metadata = convertMetaData(epub.metadata);
                    const book = {};
                    const numChapters = epub.flow.length;
                    epub.flow.forEach((chapter) => {
                        const isMetaChapter = !('title' in chapter && 'order' in chapter);
                        if (isMetaChapter) {
                            console.log(`Now at meta chapter - id: ${chapter.id} / href: ${chapter.href} `);
                        } else {
                            console.log(`Now at chapter ${chapter.order} - title: ${chapter.title}`);
                        }

                        epub.getChapter(chapter.id, function (err, text) {
                            // console.log(text);
                            book[chapter.id] = Object.assign({text: converter.convert(text)}, chapter);
                            if (isConversionCompleted()) {
                                resolve({metadata, book});
                            }
                        });
                    });

                    function isConversionCompleted() {
                        return Object.keys(book).length === numChapters;
                    }

                    function convertMetaData(metadata: object): object {
                        return Object.keys(metadata)
                            .reduce((obj, key) => {
                                obj[key] = converter.convert(metadata[key]);
                                return obj;
                            }, {});
                    }
                });
                epub.parse();
            });
        }
    }
}