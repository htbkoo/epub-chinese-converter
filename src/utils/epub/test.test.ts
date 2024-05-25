// @ts-nocheck

import * as assert from 'assert';
import { EPub } from "./epub";
import path from "path";


const normalizeRelativePath = (relativePath: string) => path.normalize(`${__dirname}/${relativePath}`);
const exampleFilePath = normalizeRelativePath('../../test/resources/epub/example/alice.epub');

describe('EPub', () => {
	it('init', () => {
		const epub = new EPub(exampleFilePath);
		assert.strictEqual(
			epub.imageroot,
			`/images/`
		);
	});

	it('basic parsing', () => {
		const epub = new EPub(exampleFilePath);
		epub.parse();

		assert.strictEqual(
			epub.imageroot,
			`/images/`
		);
	});

	it('supports empty chapters', () => {
		var branch = [{navLabel: { text: '' }}];
		const epub = new EPub();
		var res = epub.walkNavMap(branch, [], []);
		assert.ok(res);
	});
});
