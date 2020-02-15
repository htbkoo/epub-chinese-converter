import {createConverterMap, LangType, SrcPack} from 'tongwen-core';
import * as EPub from "epub";
import {Converter} from "tongwen-core/esm/converter/types";
import {CHAR_DICTIONARY, PHRASE_DICTIONARY} from "./resources/dictionary";
import {mapValues} from "lodash";

namespace Book{
    export type Metadata = object;
    export type ChapterText = string;
    export type Chapter = object & { text: ChapterText };
    export type Chapters = { [id: string]: Chapter };
}

interface SimplifiedToTraditionalConverter {
    convert: (text: string) => string;
    convertMetaData: (metadata: EPub.Metadata) => Book.Metadata;
    converter: Converter;
}

interface ConvertedBook {
    metadata;
    book;
}

type EPubChapterId = EPub.TocElement["id"];

export function createSimplifiedToTraditionalConverter(): SimplifiedToTraditionalConverter {
    const src: SrcPack = {s2t: [CHAR_DICTIONARY, PHRASE_DICTIONARY], t2s: []};
    const converter = createConverterMap(src);

    return {
        convert(text: string) {
            return converter.phrase(LangType.s2t, text);
        },
        convertMetaData(metadata) {
            return mapValues(metadata, this.convert);
        },
        converter
    }
}

export function epubConverter(path: string) {
    return {
        async convert(converter: SimplifiedToTraditionalConverter): Promise<ConvertedBook> {
            const epub = new EPub(path);

            return new Promise(resolve => {
                epub.on("end", async () => {
                    // epub is now usable
                    console.log(`Converting the book - ${epub.metadata.title}`);

                    const metadata = converter.convertMetaData(epub.metadata);
                    const book = await readAndConvertBook(epub, converter);

                    resolve({metadata, book});
                });
                epub.parse();
            });
        }
    };
}

function asLoggingInfo(chapter: EPub.TocElement): string {
    const isMetaChapter = !('title' in chapter && 'order' in chapter);
    if (isMetaChapter) {
        return `Now at meta chapter - id: ${chapter.id} / href: ${chapter.href} `;
    } else {
        return `Now at chapter ${chapter.order} - title: ${chapter.title}`;
    }
}

function isConversionCompleted(book: object, numChapters: number) {
    return Object.keys(book).length === numChapters;
}

async function readChapter(epub: EPub, id: EPubChapterId): Promise<Book.ChapterText> {
    return new Promise((resolve, reject) =>
        epub.getChapter(id, (err, text) =>
            err ? reject(err) : resolve(text)
        )
    )
}

async function readAndConvertBook(epub: EPub, converter: SimplifiedToTraditionalConverter) {
    const book = {};
    const numChapters = epub.flow.length;

    return new Promise(resolve =>
        epub.flow.forEach(async chapter => {
            console.log(asLoggingInfo(chapter));

            const chapterText = await readChapter(epub, chapter.id);
            book[chapter.id] = Object.assign({text: converter.convert(chapterText)}, chapter);
            if (isConversionCompleted(book, numChapters)) {
                resolve(book);
            }
        })
    )
}