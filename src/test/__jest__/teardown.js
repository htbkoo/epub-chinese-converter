const {EPUB_TO_BE_CREATED_URL} = require("./utils");
const fs = require("fs");

afterEach(() => {
    console.log('afterEach');
    tryRemovingFile(EPUB_TO_BE_CREATED_URL);
});

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