import {createConverterMap, LangType, SrcPack} from 'tongwen-core';
import * as EPub from "epub";
import {Converter} from "tongwen-core/esm/converter/types";
import produce from "immer";
import {mapValues} from "lodash";

import {CHAR_DICTIONARY, PHRASE_DICTIONARY} from "./resources/dictionary";

type EPubChapterId = EPub.TocElement["id"];

namespace Book {
    export type Metadata = object;
    export type ChapterText = string;
    export type Chapter = object & { text: ChapterText };
    export type Chapters = { [id: string]: Chapter };
    export type BookWithMeta = { metadata: Metadata; chapters: Chapters; };
}

interface SimplifiedToTraditionalConverter {
    convert: (text: string) => string;
    convertMetaData: (metadata: EPub.Metadata) => Book.Metadata;
    convertChapters: (chapters: Book.Chapters) => Book.Chapters;
    convertBook: (book: Book.BookWithMeta) => Book.BookWithMeta;
    converter: Converter;
}

export function createSimplifiedToTraditionalConverter(): SimplifiedToTraditionalConverter {
    const NO_TRANSLATION_PROVIDED_FROM_TRADITIONAL_TO_SIMPLIFIED = [];
    const src: SrcPack = {s2t: [CHAR_DICTIONARY, PHRASE_DICTIONARY], t2s: NO_TRANSLATION_PROVIDED_FROM_TRADITIONAL_TO_SIMPLIFIED};
    const converter = createConverterMap(src);

    return {
        convert(text: string) {
            return converter.phrase(LangType.s2t, text);
        },
        convertMetaData(metadata) {
            return mapValues(metadata, this.convert);
        },
        convertChapters(chapters) {
            return mapValues(chapters, chapter =>
                produce(chapter, draft => {
                    draft.text = this.convert(draft.text)
                })
            );
        },
        convertBook(book) {
            const metadata = this.convertMetaData(book.metadata);
            const chapters = this.convertChapters(book.chapters);
            return {metadata, chapters};
        },
        converter
    }
}

export async function readEpub(path: string): Promise<Book.BookWithMeta> {
    const epub = new EPub(path);

    return new Promise(resolve => {
        epub.on("end", async () => {
            // epub is now usable
            console.log(`Converting the book - ${epub.metadata.title}`);
            const metadata = epub.metadata;
            const chapters = await readChapters(epub);
            resolve({metadata, chapters});
        });
        epub.parse();
    });
}

function asLoggingInfo(chapter: EPub.TocElement): string {
    const isMetaChapter = !('title' in chapter && 'order' in chapter);
    if (isMetaChapter) {
        return `Now at meta chapter - id: ${chapter.id} / href: ${chapter.href} `;
    } else {
        return `Now at chapter ${chapter.order} - title: ${chapter.title}`;
    }
}

async function readChapters(epub: EPub): Promise<Book.Chapters> {
    return epub.flow.reduce(async (prevPromise, chapter) => {
        console.log(asLoggingInfo(chapter));

        const chapters = await prevPromise;
        const text = await readChapter(epub, chapter.id);
        chapters[chapter.id] = Object.assign({text}, chapter);

        return chapters;
    }, Promise.resolve({} as Book.Chapters));
}

async function readChapter(epub: EPub, id: EPubChapterId): Promise<Book.ChapterText> {
    return new Promise((resolve, reject) =>
        epub.getChapter(id, (err, text) =>
            err ? reject(err) : resolve(text)
        )
    )
}