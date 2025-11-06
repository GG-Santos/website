import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta = {
	title: "shadcn/Progress",
	component: Progress,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Progress value={33} className="w-[60%]" />,
};

export const HalfComplete: Story = {
	render: () => <Progress value={50} className="w-[60%]" />,
};

export const AlmostComplete: Story = {
	render: () => <Progress value={90} className="w-[60%]" />,
};








