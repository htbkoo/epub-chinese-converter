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
1. As of v0.1.0, only translation from Simplified Chinese to Traditional Chinese is supported

### Caveats
1. (Help wanted) When using this package as a library in browser environment, **only the converter part can be used** , and it should be imported in this way: 
    
    `import {createSimplifiedToTraditionalConverter} from "epub-chinese-converter/dist/converter";`
      
   Other error like this would be thrown:
   
   `Module not found: Can't resolve 'aws-sdk' in 'node_modules\node-pre-gyp\lib'`