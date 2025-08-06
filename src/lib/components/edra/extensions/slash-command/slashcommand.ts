import { Editor, Extension, type Range } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { createSlashSuggestion } from './createSlashSuggestion';
import Suggestion, { type SuggestionOptions } from '@tiptap/suggestion';

export interface SlashExtensionOptions {
	suggestion: Omit<SuggestionOptions, 'editor'>;
}

const extensionName = 'slashCommand';

export const SlashCommand = Extension.create<SlashExtensionOptions>({
	name: extensionName,

	addOptions() {
		return {
			suggestion: {
				char: '/',
				allowSpaces: false,
				pluginKey: new PluginKey(extensionName),
				allow: ({ editor, range }: { editor: Editor; range: Range; isActive?: boolean }) => {
					const { state } = editor;
					const $from = state.doc.resolve(range.from);
					const afterContent = $from.parent.textContent?.substring(
						$from.parent.textContent?.indexOf('/')
					);
					const isValidAfterContent = !afterContent?.endsWith('  ');

					return isValidAfterContent;
				},
				command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
					editor.chain().focus().deleteRange(range).run();
					console.log(props);
					props.onClick?.(editor);
				},
				...createSlashSuggestion()
			}
		};
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion
			})
		];
	},

	addStorage() {
		return {
			rect: {
				width: 0,
				height: 0,
				left: 0,
				top: 0,
				right: 0,
				bottom: 0
			}
		};
	}
});
