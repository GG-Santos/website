import type { Meta, StoryObj } from "@storybook/react";
import { Field } from "@shadcn/field";
import { Input } from "@shadcn/input";
import { Label } from "@shadcn/label";

const meta = {
	title: "shadcn/Field",
	component: Field,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Field className="w-full max-w-sm">
			<Label htmlFor="email">Email</Label>
			<Input id="email" type="email" placeholder="Email" />
		</Field>
	),
};

