import type {
	SuggestionKeyDownProps,
	SuggestionOptions,
	SuggestionProps
} from '@tiptap/suggestion';
import GROUPS, { type Group } from './groups';
import SlashCommandList from '../../shadcn/components/SlashCommandList.svelte';
import { mount, unmount } from 'svelte';

export interface SlashCommandExtensionOptions {
	suggestion: Omit<SuggestionOptions<Group>, 'editor'>;
	groups: Group[];
}

export function createSlashSuggestion() {
	return {
		items: ({ query }: { query: string }) => {
			const q = query.toLowerCase().trim();
			const withFilteredCommands = GROUPS.map((group) => ({
				...group,
				commands: group.actions.filter((item) => {
					const labelNormalized = item.tooltip!.toLowerCase().trim();
					const queryNormalized = q;
					return labelNormalized.includes(queryNormalized);
				})
			}));

			const withoutEmptyGroups = withFilteredCommands.filter((group) => {
				if (group.commands.length > 0) {
					return true;
				}

				return false;
			});

			const withEnabledSettings = withoutEmptyGroups.map((group) => ({
				...group,
				commands: group.commands.map((command) => ({
					...command,
					isEnabled: true
				}))
			}));

			return withEnabledSettings;
		},
		render: () => {
			let component: ReturnType<typeof mount>;
			let element: HTMLElement;

			return {
				onStart: (props: SuggestionProps) => {
					element = document.createElement('div');
					element.className = 'slash-suggestion-container';

					// Position relative to editor
					const editorElement = props.editor.view.dom;
					const editorContainer = editorElement.closest('.editor-container');

					if (editorContainer) {
						editorContainer.appendChild(element);
					} else {
						document.body.appendChild(element);
					}

					component = mount(SlashCommandList, {
						target: element,
						props: { ...props }
					});

					updatePosition(props, element);
				},

				onUpdate(props: SuggestionProps) {
					if (component) {
						unmount(component);
					}

					component = mount(SlashCommandList, {
						target: element,
						props: { ...props }
					});

					updatePosition(props, element);
				},

				onKeyDown(props: SuggestionKeyDownProps) {
					console.log('down!~', props);
					if (props.event.key === 'Escape') {
						unmount(component);
						return true;
					}
					if (props.event.key === 'Enter') {
						return true;
					}

					return false;
				},

				onExit(props: SuggestionProps) {
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

export function updatePosition(props: SuggestionProps, element: HTMLElement) {
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
