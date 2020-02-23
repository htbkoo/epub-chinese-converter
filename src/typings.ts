import {Metadata as EpubMetadata} from "epub";

export namespace Book {
    export type Metadata = EpubMetadata | object;
    export type ChapterText = string;
    export type Chapter = object & { text: ChapterText };
    export type Chapters = { [id: string]: Chapter };
    export type BookWithMeta = { metadata: Metadata; chapters: Chapters; };
}
