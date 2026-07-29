import type { JSONContent } from '@tiptap/core';
import { slugify } from './blog';

export type TocHeading = {
	id: string;
	text: string;
	level: number;
};

function extractText(node: JSONContent): string {
	if (node.text) return node.text;
	if (!node.content) return '';
	return node.content.map(extractText).join('');
}

export function extractHeadings(content: JSONContent): TocHeading[] {
	const headings: TocHeading[] = [];
	const seen = new Map<string, number>();

	function visit(node: JSONContent) {
		if (node.type === 'heading') {
			const level = (node.attrs?.level as number) ?? 1;
			const text = extractText(node).trim();
			if (text) {
				const base = slugify(text) || 'section';
				const count = seen.get(base) ?? 0;
				seen.set(base, count + 1);
				headings.push({ id: count > 0 ? `${base}-${count}` : base, text, level });
			}
		}
		node.content?.forEach(visit);
	}

	visit(content);
	return headings;
}

/** Adds `id` attributes to heading tags in Tiptap-generated HTML, in document order. */
export function injectHeadingIds(html: string, headings: TocHeading[]): string {
	let index = 0;
	return html.replace(/<h([1-4])(\s[^>]*)?>/g, (match, level, attrs = '') => {
		const heading = headings[index];
		index++;
		if (!heading || /\sid=/.test(attrs)) return match;
		return `<h${level}${attrs} id="${heading.id}">`;
	});
}
