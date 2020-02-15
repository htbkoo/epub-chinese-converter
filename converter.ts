import {createConverterMap, LangType, SrcPack} from 'tongwen-core';
import * as EPub from "epub";
import {Converter} from "tongwen-core/esm/converter/types";

import {CHAR_DICTIONARY, PHRASE_DICTIONARY} from "./resources/dictionary";

interface SimplifiedToTraditionalConverter {
    convert: (text: string) => string;
    convertMetaData: (metadata: EPub.Metadata) => object;
    converter: Converter;
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
        convertMetaData(metadata: object): object {
            return Object.keys(metadata)
                .reduce((obj, key) => {
                    obj[key] = this.convert(metadata[key]);
                    return obj;
                }, {});
        },
        converter
    }
}

export function epubConverter(path: string) {
    return {
        async convert(converter: SimplifiedToTraditionalConverter): Promise<ConvertedBook> {
            const epub = new EPub(path);

            return new Promise(resolve => {
                epub.on("end", function () {
                    // epub is now usable
                    -console.log(`Converting the book - ${epub.metadata.title}`);
                    const metadata = converter.convertMetaData(epub.metadata);
                    const book = {};
                    const numChapters = epub.flow.length;
                    epub.flow.forEach(async chapter => {
                        if (isMetaChapter(chapter)) {
                            console.log(`Now at meta chapter - id: ${chapter.id} / href: ${chapter.href} `);
                        } else {
                            console.log(`Now at chapter ${chapter.order} - title: ${chapter.title}`);
                        }

                        const text = await readChapter(epub, chapter.id);
                        book[chapter.id] = Object.assign({text: converter.convert(text)}, chapter);
                        if (isConversionCompleted(book, numChapters)) {
                            resolve({metadata, book});
                        }
                    });
                });
                epub.parse();
            });
        }
    };
}

function isConversionCompleted(book: object, numChapters: number) {
    return Object.keys(book).length === numChapters;
}

function isMetaChapter(chapter: EPub.TocElement) {
    return !('title' in chapter && 'order' in chapter);
}

async function readChapter(epub: EPub, id: EPub.TocElement["id"]): Promise<string> {
    return new Promise((resolve, reject) => {
        epub.getChapter(id, (err, text) => {
            if (err) {
                reject(err)
            } else {
                resolve(text);
            }
        });
    })
}