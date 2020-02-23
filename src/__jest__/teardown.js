const {EPUB_TO_BE_CREATED_URL} = require("../epub-io.test");
const fs = require("fs");

afterAll(() => {
    console.log('afterAll');
    tryRemovingFile(EPUB_TO_BE_CREATED_URL);
});

function tryRemovingFile(url) {
    try {
        if (fs.existsSync(url)) {
            //file exists
            fs.unlinkSync(url);
        }
    } catch (ignore) {
        console.warn(ignore);
    }
}