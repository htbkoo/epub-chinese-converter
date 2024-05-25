import EpubGen from "epub-gen";
import { Book } from "./typings";
import { TocElement } from "./utils/types";
import { EPub } from "./utils/epub";

export type EPubChapterId = TocElement["id"];

export async function readEpub(path: string): Promise<Book.BookWithMeta> {
  const epub = new EPub(path);

  return new Promise((resolve, reject) => {
    epub.on("end", async () => {
      // epub is now usable
      console.log(`Converting the book - ${epub.metadata.title}`);
      const metadata = epub.metadata;
      const chapters = await readChapters(epub);
      resolve({ metadata, chapters });
    });
    epub.on('error', async (e) => {
      reject(e);
    });
    epub.parse();
  });
}

export async function createEpub(options, output?: string) {
  return new EpubGen(options, output).promise.then(
    () => {
      console.log(`Ebook Generated Successfully at path: ${output}!`);
    },
    err => {
      console.error("Failed to generate Ebook because of ", err)
    }
  );
}

function asLoggingInfo(chapter: TocElement): string {
  const isMetaChapter = !('title' in chapter && 'order' in chapter);
  if (isMetaChapter) {
    return `Now at meta chapter - id: ${chapter.id} / href: ${chapter.href} `;
  } else {
    return `Now at chapter ${chapter.order} - title: ${chapter.title}`;
  }
}

async function readChapters(epub: EPub): Promise<Book.Chapters> {
  return epub.flow.reduce(async (prevPromise, chapter) => {
    console.log(asLoggingInfo(chapter));

    const chapters = await prevPromise;
    const text = await readChapter(epub, chapter.id);
    chapters[chapter.id] = Object.assign({ text }, chapter);

    return chapters;
  }, Promise.resolve({} as Book.Chapters));
}

async function readChapter(epub: EPub, id: EPubChapterId): Promise<Book.ChapterText> {
  return new Promise((resolve, reject) =>
    epub.getChapter(id, (err, text) =>
      err ? reject(err) : resolve(text)
    )
  )
}
