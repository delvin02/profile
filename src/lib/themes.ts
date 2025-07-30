import type { Theme } from '@/routes/settings/schema';

export interface ThemeConfig {
	name: Theme;
	displayName: string;
	colors: string[];
	preview?: {
		background: string;
		text: string;
		accent: string;
	};
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
	default: {
		name: 'default',
		displayName: 'Default',
		colors: ['#8b5cf6', '#ffffff', '#dbeafe'],
		preview: {
			background: '#8b5cf6',
			text: '#ffffff',
			accent: '#dbeafe'
		}
	},
	claude: {
		name: 'claude',
		displayName: 'Claude',
		colors: ['#c96442', '#ffffff', '#e9e6dc'],
		preview: {
			background: '#c96442',
			text: '#ffffff',
			accent: '#e9e6dc'
		}
	},
	mono: {
		name: 'mono',
		displayName: 'Monochrome',
		colors: ['#737373', '#fafafa', '#f5f5f5'],
		preview: {
			background: '#737373',
			text: '#fafafa',
			accent: '#f5f5f5'
		}
	},
	'modern-minimal': {
		name: 'modern-minimal',
		displayName: 'Modern Minimal',
		colors: ['#3b82f6', '#ffffff', '#e0f2fe'],
		preview: {
			background: '#3b82f6',
			text: '#ffffff',
			accent: '#e0f2fe'
		}
	}
};

export function getThemeConfig(theme: Theme): ThemeConfig {
	return themeConfigs[theme];
}

export function getAllThemes(): ThemeConfig[] {
	return Object.values(themeConfigs);
}
