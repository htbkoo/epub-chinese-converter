# epub-chinese-converter [![npm](https://img.shields.io/npm/v/epub-chinese-converter)](https://www.npmjs.com/package/epub-chinese-converter) [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/htbkoo/epub-chinese-converter/Node%20CI)](https://github.com/htbkoo/epub-chinese-converter/actions?query=workflow%3A%22Node+CI%22)

A small util to convert `epub` files from Simplified Chinese to Traditional Chinese

### Installation

`npm install epub-chinese-converter --save`

### Usage
(See the test files under `src/` for details)

- Read epub file: 
```
import {readEpub} from "epub-chinese-converter";
const book = await readEpub(BOOK_URL);
const { metadata, chapters } = book;
```

- Conversion
```
import {createSimplifiedToTraditionalConverter} from "epub-chinese-converter";
const converter = createSimplifiedToTraditionalConverter();
const convertedBook = converter.convertBook(book);
const { metadata, chapters } = convertedBook;
```

### Limitations
1. As of now, only translation from Simplified Chinese to Traditional Chinese is supported

### Inlined dependencies
1. [`julien-c/epub`](https://github.com/htbkoo/epub-chinese-converter/tree/master/src/utils/epub)
2. [`cthackers/adm-zip`](https://github.com/htbkoo/epub-chinese-converter/tree/master/src/utils/adm-zip)
    1. patched with this commit ([`027f6d1`](https://github.com/htbkoo/epub-chinese-converter/commit/027f6d15440ae8877b62543f31d7f35ad39b113e)) to fix issue when reading `epub` file 
