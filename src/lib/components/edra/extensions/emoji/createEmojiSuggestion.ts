import { gitHubEmojis, type EmojiItem } from '@tiptap/extension-emoji';
import { mount, unmount } from 'svelte';
import EmojiList from '../../shadcn/components/EmojiList.svelte';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';

export function createEmojiSuggestion() {
	return {
		items: ({ query }: { query: string }): EmojiItem[] => {
			if (!query) {
				return gitHubEmojis.slice(0, 10); // Show first 10 emojis when no query
			}

			const filtered = gitHubEmojis
				.filter(
					(emoji) =>
						emoji.name.toLowerCase().includes(query.toLowerCase()) ||
						emoji.shortcodes?.some((shortcode) =>
							shortcode.toLowerCase().includes(query.toLowerCase())
						) ||
						emoji.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
				)
				.slice(0, 10);

			return filtered;
		},

		render: () => {
			let component: ReturnType<typeof mount>;
			let element: HTMLElement;

			return {
				onStart: (props: SuggestionProps<EmojiItem>) => {
					element = document.createElement('div');
					element.className = 'emoji-suggestion-container';

					// Position relative to editor
					const editorElement = props.editor.view.dom;
					const editorContainer = editorElement.closest('.editor-container');

					if (editorContainer) {
						editorContainer.appendChild(element);
					} else {
						document.body.appendChild(element);
					}

					component = mount(EmojiList, {
						target: element,
						props: { ...props }
					});

					updatePosition(props, element);
				},

				onUpdate: (props: SuggestionProps<EmojiItem>) => {
					if (component) {
						unmount(component);
						component = mount(EmojiList, {
							target: element,
							props: { ...props }
						});
					}
				},

				onKeyDown: (props: SuggestionKeyDownProps) => {
					if (props.event.key === 'Escape') {
						return true;
					}
					return false;
				},

				onExit: (props: SuggestionProps<EmojiItem>) => {
					if (component) {
						unmount(component);
					}
					if (element?.parentNode) {
						element.parentNode.removeChild(element);
					}

					props.editor.chain().focus().run();
				}
			};
		}
	};
}

function updatePosition(props: SuggestionProps, element: HTMLElement) {
	const { view } = props.editor;
	const { state } = view;
	const { from } = state.selection;

	try {
		const coords = view.coordsAtPos(from);
		// const editorRect = view.dom.getBoundingClientRect();
		const containerRect = element.parentElement?.getBoundingClientRect();

		if (containerRect) {
			const left = coords.left - containerRect.left;
			const top = coords.bottom - containerRect.top - 10;

			element.style.cssText = `
                position: absolute;
                left: ${left}px;
                top: ${top}px;
                z-index: 1000;
                pointer-events: auto;
            `;
		}
	} catch (error) {
		console.warn('Could not position emoji dropdown:', error);
	}
}
