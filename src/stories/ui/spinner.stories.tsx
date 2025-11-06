import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "@shadcn/spinner";

const meta = {
	title: "shadcn/Spinner",
	component: Spinner,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Spinner />,
};

