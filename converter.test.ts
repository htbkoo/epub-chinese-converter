import {createSimplifiedToTraditionalConverter, epubConverter} from "./converter";

describe("converter", function () {
    it("should convert", async (done) => {
        jest.setTimeout(60000);

        // given
        const converter = createSimplifiedToTraditionalConverter();
        const BOOK_URL = "./resources/GeographyofBliss_oneChapter.epub";

        // when
        // then
        return epubConverter(BOOK_URL).convert(converter)
            .then(({metadata, book}) => {
                expect(Object.keys(metadata)).toHaveLength(10);
                expect(Object.keys(book)).toHaveLength(4);
                done();
            });
    });
});