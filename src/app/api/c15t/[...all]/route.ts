import { NextRequest } from 'next/server';
import { c15tInstance } from '@c15t/backend/v2';
import { prismaAdapter } from '@c15t/backend/v2/db/adapters/prisma';
import prisma from '@/lib/prisma';

// Create the c15t instance
const handler = c15tInstance({
	appName: process.env.NEXT_PUBLIC_SITE_NAME || 'website',
	basePath: '/api/c15t',
	adapter: prismaAdapter({
		provider: 'mongodb',
		prisma,
	}),
	trustedOrigins: [
		process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
		process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
	].filter(Boolean) as string[],
	advanced: {
		disableGeoLocation: process.env.NODE_ENV === 'development',
		openapi: {
			enabled: process.env.NODE_ENV === 'development',
		},
	},
	logger: {
		level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
	},
});

// Handle all HTTP methods
export async function GET(request: NextRequest) {
	return handler.handler(request);
}

export async function POST(request: NextRequest) {
	return handler.handler(request);
}

export async function PUT(request: NextRequest) {
	return handler.handler(request);
}

export async function DELETE(request: NextRequest) {
	return handler.handler(request);
}

export async function PATCH(request: NextRequest) {
	return handler.handler(request);
}

export async function OPTIONS(request: NextRequest) {
	return handler.handler(request);
}

