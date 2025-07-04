import { Editor, type Extensions, type EditorOptions, type Content } from '@tiptap/core';
import { getHandlePaste } from './utils.js';
import 'katex/dist/katex.min.css';
import { TIPTAP_EXTENSIONS } from './extensions';

export default (
	element?: HTMLElement,
	content?: Content,
	extensions?: Extensions,
	options?: Partial<EditorOptions>
) => {
	const editor = new Editor({
		element,
		content,
		extensions: [...TIPTAP_EXTENSIONS, ...(extensions ?? [])],
		...options
	});

	editor.setOptions({
		editorProps: {
			handlePaste: getHandlePaste(editor)
		}
	});
	return editor;
};
