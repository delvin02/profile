import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import Image, { type ImageOptions } from '@tiptap/extension-image';
import type { Component } from 'svelte';
import type { NodeViewProps, Node } from '@tiptap/core';
import { cn } from '@/lib/utils';

export const ImageExtended = (component: Component<NodeViewProps>): Node<ImageOptions, unknown> => {
	return Image.extend({
		addAttributes() {
			return {
				src: {
					default: null
				},
				alt: {
					default: null
				},
				title: {
					default: null
				},
				width: {
					default: '100%'
				},
				height: {
					default: null
				},
				align: {
					default: 'left'
				},
				class: {
					default: null,
					parseHTML: (element: HTMLElement) => {
						console.log(element);
						return element.getAttribute('class');
					},

					renderHTML: (attrs: { align?: 'left' | 'center' | 'right'; class?: string }) => {
						let alignClass: string;
						switch (attrs.align) {
							case 'center':
								alignClass = 'mx-auto';
								break;
							case 'right':
								alignClass = 'ml-auto';
								break;
							default:
								alignClass = 'mr-auto';
						}

						return {
							class: cn(alignClass, attrs.class)
						};
					}
				}
			};
		},
		addNodeView: () => {
			return SvelteNodeViewRenderer(component);
		}
	}).configure({
		allowBase64: true
	});
};
