import {createSimplifiedToTraditionalConverter, epubConverter, readEpub} from "./converter";

describe("converter", function () {
    it("should read and convert", async () => {
        jest.setTimeout(60000);

        // given
        const converter = createSimplifiedToTraditionalConverter();
        const BOOK_URL = "./resources/GeographyofBliss_oneChapter.epub";

        // when
        const book = await readEpub(BOOK_URL);
        assertBook(book, {metadata: 10, chapters: 4});

        const convertedBook = converter.convertBook(book);
        assertBook(convertedBook, {metadata: 10, chapters: 4});
    });

    function assertBook({metadata, chapters}, expectedLengths) {
        // then
        expect(Object.keys(metadata)).toHaveLength(expectedLengths.metadata);
        expect(Object.keys(chapters)).toHaveLength(expectedLengths.chapters);
    }
});