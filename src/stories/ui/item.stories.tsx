import type { Meta, StoryObj } from "@storybook/react";
import { Item } from "@shadcn/item";

const meta = {
	title: "shadcn/Item",
	component: Item,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Item>Item content</Item>,
};

