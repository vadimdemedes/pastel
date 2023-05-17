import {ComponentType} from 'react';

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
};
