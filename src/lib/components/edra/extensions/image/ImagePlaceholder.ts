import { Editor, Node, mergeAttributes, type CommandProps, type NodeViewProps } from '@tiptap/core';
import type { Component } from 'svelte';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';

export interface ImagePlaceholderOptions {
	HTMLAttributes: Record<string, object>;
	onDrop: (files: File[], editor: Editor) => void;
	onDropRejected?: (files: File[], editor: Editor) => void;
	onEmbed: (url: string, editor: Editor) => void;
	allowedMimeTypes?: Record<string, string[]>;
	maxFiles?: number;
	maxSize?: number;
}

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		imagePlaceholder: {
			/**
			 * Inserts an image placeholder
			 */
			insertImagePlaceholder: () => ReturnType;
		};
	}
}

export const ImagePlaceholder = (
	component: Component<NodeViewProps>
): Node<ImagePlaceholderOptions> =>
	Node.create<ImagePlaceholderOptions>({
		name: 'image-placeholder',
		addOptions() {
			return {
				HTMLAttributes: {},
				onDrop: () => {
					console.log('onDrop');
				},
				onDropRejected: () => {},
				onEmbed: () => {}
			};
		},
		parseHTML() {
			return [{ tag: `div[data-type="${this.name}"]` }];
		},

		renderHTML({ HTMLAttributes }) {
			return [
				'figure',
				mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes),
				['figcaption', { class: 'mt-2 text-sm italic text-center text-muted-foreground' }, 1]
			];
		},
		group: 'block',
		draggable: false,
		atom: false,
		content: 'inline*',
		isolating: true,

		addNodeView() {
			return SvelteNodeViewRenderer(component);
		},
		addCommands() {
			return {
				insertImagePlaceholder: () => (props: CommandProps) => {
					return props.commands.insertContent({
						type: 'image-placeholder'
					});
				}
			};
		}
	});
