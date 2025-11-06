import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@shadcn/input";
import { Label } from "@shadcn/label";

const meta = {
	title: "shadcn/Input",
	component: Input,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Input placeholder="Enter text..." />,
};

export const WithLabel: Story = {
	render: () => (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="email">Email</Label>
			<Input type="email" id="email" placeholder="Email" />
		</div>
	),
};

export const File: Story = {
	render: () => (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="picture">Picture</Label>
			<Input id="picture" type="file" />
		</div>
	),
};

export const Disabled: Story = {
	render: () => <Input disabled placeholder="Disabled input" />,
};

export const WithDefaultValue: Story = {
	render: () => <Input defaultValue="Default value" />,
};

