import type {AppProps} from './types.js';

export default function App({Component, commandProps}: AppProps) {
	return <Component {...commandProps} />;
}
