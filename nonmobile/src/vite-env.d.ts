/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
	readonly TENANT_ID?: string;
	// add more env vars as needed
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

// Type declarations for modules
declare module "lodash" {
	interface ThrottleSettings {
		leading?: boolean;
		trailing?: boolean;
	}

	interface ThrottledFunction<T extends (...args: any[]) => any> {
		(...args: Parameters<T>): ReturnType<T>;
		cancel(): void;
		flush(): void;
	}

	export function throttle<T extends (...args: any[]) => any>(
		func: T,
		wait?: number,
		options?: ThrottleSettings,
	): ThrottledFunction<T>;
	export * from "lodash";
}

declare module "web-vitals" {
	export function onCLS(callback: (metric: unknown) => void): void;
	export function onINP(callback: (metric: unknown) => void): void;
	export function onFCP(callback: (metric: unknown) => void): void;
	export function onLCP(callback: (metric: unknown) => void): void;
	export function onTTFB(callback: (metric: unknown) => void): void;
}

// SVG imports with ?react query
declare module "*.svg?react" {
	import React from "react";
	const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
	export default ReactComponent;
}

// Test modules (these are available at runtime but TypeScript needs declarations)
declare module "@testing-library/react" {
	export function render(component: any, options?: any): any;
	export const screen: any;
}

declare module "vitest" {
	export function describe(name: string, fn: () => void): void;
	export function it(name: string, fn: () => void): void;
	export function expect(value: any): any;
}
