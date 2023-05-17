import {type ComponentType} from 'react';

export type AppProps = {
	Component: ComponentType<{
		options: Record<string, unknown>;
		args: unknown[];
	}>;
	commandProps: {
		options: Record<string, unknown>;
		args: unknown[];
	};
};

export type CommandOptionConfig = {
	description?: string;
	defaultValueDescription?: string;
	valueDescription?: string;
	alias?: string;
};

export type CommandArgumentConfig = {
	name?: string;
	description?: string;
	defaultValueDescription?: string;
};
