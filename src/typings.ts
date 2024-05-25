import Epub from './utils/epub'

export namespace Book {
    export type Metadata = Epub.Metadata | object;
    export type ChapterText = string;
    export type Chapter = object & { text: ChapterText };
    export type Chapters = { [id: string]: Chapter };
    export type BookWithMeta = { metadata: Metadata; chapters: Chapters; };
}
