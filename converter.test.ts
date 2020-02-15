import {createSimplifiedToTraditionalConverter, epubConverter} from "./converter";

describe("converter", function () {
    it("should convert", async (done) => {
        jest.setTimeout(60000);

        // given
        const converter = createSimplifiedToTraditionalConverter();
        const BOOK_URL = "./resources/GeographyofBliss_oneChapter.epub";

        // when
        return epubConverter(BOOK_URL).convert(converter)
            .then(({metadata, chapters}) => {
                // then
                expect(Object.keys(metadata)).toHaveLength(10);
                expect(Object.keys(chapters)).toHaveLength(4);
                done();
            });
    });
});