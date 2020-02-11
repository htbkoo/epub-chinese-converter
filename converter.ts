import {createConverterMap, LangType, SrcPack} from 'tongwen-core';

import {CHAR_DICTIONARY, PHRASE_DICTIONARY} from "./resources/dictionary";

export function createSimplifiedToTraditionalConverter() {
    const dics: SrcPack = {s2t: [CHAR_DICTIONARY, PHRASE_DICTIONARY], t2s: []};
    const converter = createConverterMap(dics);

    return {
        convert(text: string) {
            return converter.phrase(LangType.s2t, text);
        },
        converter
    }
}