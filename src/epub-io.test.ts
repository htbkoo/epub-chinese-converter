import path from "path";

import {createEpub, readEpub} from "./epub-io";
import {EPUB_TO_BE_CREATED_URL} from "./__jest__/utils";

describe("epub-io", function () {
    it("should read epub", async () => {
        jest.setTimeout(60000);

        // given
        const BOOK_URL = normalizeRelativePath("./resources/GeographyofBliss_oneChapter.epub");

        // when
        const book = await readEpub(BOOK_URL);

        // then
        assertBook(book, {metadata: 10, chapters: 4});
    });

    it("should create new epub", async () => {
        // given
        const content = [
            {
                title: "About the author", // Optional
                author: "John Doe", // Optional
                data: "<h2>Charles Lutwidge Dodgson</h2>"
                    + "<div lang=\"en\">Better known by the pen name Lewis Carroll...</div>" // pass html string
            },
            {
                title: "Down the Rabbit Hole",
                data: "<p>Alice was beginning to get very tired...</p>"
            },
            {
                title: "Chapter 3 ",
                data: "<p>Some content</p>"
            },
        ];
        const option = {
            title: "Alice's Adventures in Wonderland", // *Required, title of the book.
            author: "Lewis Carroll", // *Required, name of the author.
            publisher: "Macmillan & Co.", // optional
            // cover: "http://demo.com/url-to-cover-image.jpg", // Url or File path, both ok.
            content
        };

        // when
        await createEpub(option, EPUB_TO_BE_CREATED_URL);

        // then
        const createdBook = await readEpub(EPUB_TO_BE_CREATED_URL);
        const TOC_CONTENT_SIZE = 1;
        assertBook(createdBook, {metadata: 18, chapters: content.length + TOC_CONTENT_SIZE});
    });

    function assertBook({metadata, chapters}, expectedLengths) {
        // then
        expect(Object.keys(metadata)).toHaveLength(expectedLengths.metadata);
        expect(Object.keys(chapters)).toHaveLength(expectedLengths.chapters);
    }

    function normalizeRelativePath(relativePath: string) {
        return path.normalize(`${__dirname}/${relativePath}`);
    }
});
