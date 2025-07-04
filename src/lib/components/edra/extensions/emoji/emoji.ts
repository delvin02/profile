import { gitHubEmojis, type EmojiItem } from '@tiptap/extension-emoji';
import { Suggestion, type SuggestionOptions } from '@tiptap/suggestion';
import { Editor, Extension, type Range } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { createEmojiSuggestion } from './createEmojiSuggestion';

export interface EmojiExtensionOptions {
	suggestion: Omit<SuggestionOptions<EmojiItem>, 'editor'>;
	emojis: EmojiItem[];
}

export const EmojiExtension = Extension.create<EmojiExtensionOptions>({
	name: 'emoji',

	addOptions() {
		return {
			suggestion: {
				char: ':',
				pluginKey: new PluginKey('emoji'),
				command: ({ editor, range, props }: { editor: Editor; range: Range; props: EmojiItem }) => {
					editor
						.chain()
						.focus()
						.deleteRange(range)
						.insertContent(props.emoji + ' ')
						.run();
				},
				...createEmojiSuggestion()
			},
			emojis: gitHubEmojis
		};
	},

	addProseMirrorPlugins() {
		return [
			Suggestion({
				editor: this.editor,
				...this.options.suggestion
			})
		];
	}
});
