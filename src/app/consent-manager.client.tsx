'use client';

import type { ReactNode } from 'react';
import { ClientSideOptionsProvider } from '@c15t/nextjs/client';

/**
 * Client-side consent manager wrapper for handling scripts and callbacks
 *
 * This component is rendered on the client and provides the ability to:
 * - Load integration scripts (Google Tag Manager, Meta Pixel, TikTok Pixel, etc.)
 * - Handle client-side callbacks (onConsentSet, onError, onBannerFetched)
 * - Manage script lifecycle (onLoad, onDelete)
 *
 * @param props - Component properties
 * @param props.children - Child components to render within the client-side context
 *
 * @returns The client-side options provider with children
 *
 * @see https://c15t.com/docs/frameworks/next/callbacks
 * @see https://c15t.com/docs/frameworks/next/script-loader
 */
export function ConsentManagerClient({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<ClientSideOptionsProvider
			// 📝 Add your integration scripts here
			// Scripts are loaded when consent is given and removed when consent is revoked
			// Example: Google Tag Manager, Meta Pixel, TikTok Pixel, etc.
			scripts={[]}
			// 📝 Add your callbacks here
			// Callbacks allow you to react to consent events
			callbacks={{
				// Log consent decisions for debugging (remove in production if needed)
				onConsentSet(response) {
					if (process.env.NODE_ENV === 'development') {
						console.log('[c15t] Consent updated:', response);
					}
				},
				// Handle any errors that occur
				onError(error) {
					console.error('[c15t] Consent error:', error);
				},
			}}
		>
			{children}
		</ClientSideOptionsProvider>
	);
}
