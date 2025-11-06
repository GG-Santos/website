import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "@shadcn/toggle";

const meta = {
	title: "shadcn/Toggle",
	component: Toggle,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Toggle>Toggle</Toggle>,
};

export const Outline: Story = {
	render: () => <Toggle variant="outline">B</Toggle>,
};

export const Small: Story = {
	render: () => <Toggle size="sm">Sm</Toggle>,
};

export const Large: Story = {
	render: () => <Toggle size="lg">Lg</Toggle>,
};

