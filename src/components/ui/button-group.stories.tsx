import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";

const meta = {
	title: "shadcn/ButtonGroup",
	component: ButtonGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ButtonGroup>
			<Button>First</Button>
			<Button>Second</Button>
			<Button>Third</Button>
		</ButtonGroup>
	),
};








