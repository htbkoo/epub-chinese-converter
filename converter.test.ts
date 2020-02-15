import * as EPub from "epub";

import {createSimplifiedToTraditionalConverter, epubConverter} from "./converter";

describe("converter", function () {
    it("should convert", async (done) => {
        jest.setTimeout(60000);

        // given
        const converter = createSimplifiedToTraditionalConverter();
        const BOOK_URL = "./resources/book1.epub";

        // when
        // then
        return epubConverter(BOOK_URL).convert(converter)
            .then(({metadata, book}) => {
                console.log("");
            });
    });

    it("read using fs", () => {
        // const file = (await fs.promises.readFile(path.normalize(BOOK_URL))).toString();
    });
});