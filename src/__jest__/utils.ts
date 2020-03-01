import path from "path";

export const EPUB_TO_BE_CREATED_URL = normalizeRelativePath("../resources/test_epub_gen.epub");

function normalizeRelativePath(relativePath: string) {
    return path.normalize(`${__dirname}/${relativePath}`);
}
