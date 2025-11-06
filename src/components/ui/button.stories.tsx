import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta = {
	title: "shadcn/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Button",
	},
};

export const Destructive: Story = {
	args: {
		children: "Delete",
		variant: "destructive",
	},
};

export const Outline: Story = {
	args: {
		children: "Outline",
		variant: "outline",
	},
};

export const Secondary: Story = {
	args: {
		children: "Secondary",
		variant: "secondary",
	},
};

export const Ghost: Story = {
	args: {
		children: "Ghost",
		variant: "ghost",
	},
};

export const Link: Story = {
	args: {
		children: "Link",
		variant: "link",
	},
};

export const Small: Story = {
	args: {
		children: "Small",
		size: "sm",
	},
};

export const Large: Story = {
	args: {
		children: "Large",
		size: "lg",
	},
};

export const Icon: Story = {
	args: {
		children: "🚀",
		size: "icon",
	},
};

export const IconSmall: Story = {
	args: {
		children: "✨",
		size: "icon-sm",
	},
};

export const IconLarge: Story = {
	args: {
		children: "🎯",
		size: "icon-lg",
	},
};

export const Disabled: Story = {
	args: {
		children: "Disabled",
		disabled: true,
	},
};

export const WithIcon: Story = {
	args: {
		children: (
			<>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
				>
					<title>Download</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
					/>
				</svg>
				Download
			</>
		),
	},
};








