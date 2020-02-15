import {createSimplifiedToTraditionalConverter, epubConverter, readEpub} from "./converter";

describe("converter", function () {
    it("should read and convert", async (done) => {
        jest.setTimeout(60000);

        // given
        const converter = createSimplifiedToTraditionalConverter();
        const BOOK_URL = "./resources/GeographyofBliss_oneChapter.epub";

        // when
        return readEpub(BOOK_URL)
            .then(({metadata, chapters}) => {
                // then
                expect(Object.keys(metadata)).toHaveLength(10);
                expect(Object.keys(chapters)).toHaveLength(4);
                done();
            });
    });
});