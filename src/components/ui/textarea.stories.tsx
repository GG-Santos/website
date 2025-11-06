import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";
import { Textarea } from "./textarea";

const meta = {
	title: "shadcn/Textarea",
	component: Textarea,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Textarea placeholder="Type your message here." />,
};

export const WithLabel: Story = {
	render: () => (
		<div className="grid w-full gap-1.5">
			<Label htmlFor="message">Your message</Label>
			<Textarea placeholder="Type your message here." id="message" />
		</div>
	),
};

export const Disabled: Story = {
	render: () => <Textarea disabled placeholder="Disabled textarea" />,
};








