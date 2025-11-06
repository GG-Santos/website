import type { Meta, StoryObj } from "@storybook/react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@shadcn/input-group";

const meta = {
	title: "shadcn/InputGroup",
	component: InputGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<InputGroup>
			<InputGroupAddon>https://</InputGroupAddon>
			<InputGroupInput placeholder="example.com" />
		</InputGroup>
	),
};

