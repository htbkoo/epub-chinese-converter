import path from "path";

import {createSimplifiedToTraditionalConverter} from "./converter";
import {readEpub} from "./epub-io";

describe("converter", function () {
    it("should read and convert", async () => {
        jest.setTimeout(60000);

        // given
        const converter = createSimplifiedToTraditionalConverter();
        const BOOK_URL = normalizeRelativePath("./resources/GeographyofBliss_oneChapter.epub");

        // when
        const book = await readEpub(BOOK_URL);
        assertBook(book, {metadata: 10, chapters: 4});

        const convertedBook = converter.convertBook(book);
        assertBook(convertedBook, {metadata: 10, chapters: 4});
    });

    function normalizeRelativePath(relativePath: string) {
        return path.normalize(`${__dirname}/${relativePath}`);
    }

    function assertBook({metadata, chapters}, expectedLengths) {
        // then
        expect(Object.keys(metadata)).toHaveLength(expectedLengths.metadata);
        expect(Object.keys(chapters)).toHaveLength(expectedLengths.chapters);
    }
});