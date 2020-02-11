import {createConverterMap, createConverterObj, LangType, SrcPack} from 'tongwen-core';

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

function exampleCode() {

    const dics: SrcPack = {s2t: [{台灣: '台灣'}], t2s: [{台灣: '台灣'}]};
    const mConv = createConverterMap(dics);
    const oConv = createConverterObj(dics);
    const result = [mConv.phrase(LangType.s2t, '台灣'), oConv.phrase(LangType.s2t, '台灣')];
    console.log(result); // [ '台灣', '台灣' ]
}