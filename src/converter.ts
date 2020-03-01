import {createConverterMap, LangType, SrcPack} from 'tongwen-core';
import {Converter} from "tongwen-core/esm/converter/types";
import produce from "immer";
import {mapValues} from "lodash";

import {CHAR_DICTIONARY, PHRASE_DICTIONARY} from "./dictionary";
import {Book} from "./typings";

export interface SimplifiedToTraditionalConverter {
    convert: (text: string) => string;
    convertMetaData: (metadata: Book.Metadata) => Book.Metadata;
    convertChapters: (chapters: Book.Chapters) => Book.Chapters;
    convertBook: (book: Book.BookWithMeta) => Book.BookWithMeta;
    converter: Converter;
}

export function createSimplifiedToTraditionalConverter(): SimplifiedToTraditionalConverter {
    const NO_TRANSLATION_PROVIDED_FROM_TRADITIONAL_TO_SIMPLIFIED = [];
    const src: SrcPack = {
        s2t: [CHAR_DICTIONARY, PHRASE_DICTIONARY],
        t2s: NO_TRANSLATION_PROVIDED_FROM_TRADITIONAL_TO_SIMPLIFIED
    };
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
