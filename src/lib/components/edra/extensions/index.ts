import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Color, FontSize, TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { ColorHighlighter } from './ColorHighlighter';
import TextAlign from '@tiptap/extension-text-align';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import SearchAndReplace from './FindAndReplace';
import AutoJoiner from 'tiptap-extension-auto-joiner';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { Markdown } from 'tiptap-markdown';
import Highlight from '@tiptap/extension-highlight';
import { mergeAttributes, type Extensions } from '@tiptap/core';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import CodeBlock from '../shadcn/components/CodeBlock.svelte';
import Image from '@tiptap/extension-image';
import { ImageExtended } from './image/ImageExtended';
import ImageExtendedComp from '../shadcn/components/ImageExtended.svelte';
import { ImagePlaceholder } from './image/ImagePlaceholder';
import ImagePlaceholderComp from '../shadcn/components/ImagePlaceholder.svelte';
import { VideoPlaceholder } from './video/VideoPlaceholder';
import VideoPlaceHolderComp from '../shadcn/components/VideoPlaceholder.svelte';
import { VideoExtended } from './video/VideoExtended';
import VideoExtendedComp from '../shadcn/components/VideoExtended.svelte';
import slashcommand from './slash-command/slashcommand';
import SlashCommandList from '../shadcn/components/SlashCommandList.svelte';
import { EmojiExtension } from './emoji/emoji';

const lowlight = createLowlight(all);

export const TIPTAP_EXTENSIONS: Extensions = [
	StarterKit.configure({
		orderedList: {
			HTMLAttributes: {
				class: 'list-decimal'
			}
		},
		bulletList: {
			HTMLAttributes: {
				class: 'list-disc'
			}
		},
		heading: {
			levels: [1, 2, 3, 4]
		},
		link: {
			openOnClick: false,
			autolink: true,
			linkOnPaste: true
		},
		codeBlock: false
	}),
	Highlight.configure({
		multicolor: true
	}),
	Placeholder.configure({
		emptyEditorClass: 'is-empty',
		// Use a placeholder:
		// Use different placeholders depending on the node type:
		placeholder: ({ node }) => {
			if (node.type.name === 'heading') {
				return 'What’s the title?';
			} else if (node.type.name === 'paragraph') {
				return 'Press / or write something ...';
			}
			return '';
		}
	}),
	Color,
	Image,
	Subscript,
	Superscript,
	Typography,
	ColorHighlighter,
	TextStyle,
	FontSize,
	TextAlign.configure({
		types: ['heading', 'paragraph']
	}),
	TaskList,
	TaskItem.configure({
		nested: true
	}),
	SearchAndReplace,
	AutoJoiner,
	Table,
	TableHeader,
	TableRow,
	TableCell,
	Markdown.configure({
		html: true,
		tightLists: true,
		tightListClass: 'tight',
		bulletListMarker: '-',
		linkify: true,
		breaks: true,
		transformPastedText: true,
		transformCopiedText: false
	}),
	CodeBlockLowlight.configure({
		lowlight
	}).extend({
		addNodeView() {
			return SvelteNodeViewRenderer(CodeBlock);
		},
		renderHTML({ node, HTMLAttributes }) {
			return [
				'div',
				{ class: 'code-wrapper' },
				[
					'pre',
					mergeAttributes(HTMLAttributes),
					['code', { class: `language-${node.attrs.language}` }, 0]
				]
			];
		}
	}),
	ImagePlaceholder(ImagePlaceholderComp),
	ImageExtended(ImageExtendedComp),
	VideoPlaceholder(VideoPlaceHolderComp),
	VideoExtended(VideoExtendedComp),
	slashcommand(SlashCommandList),
	//SlashExtension,
	EmojiExtension
];
