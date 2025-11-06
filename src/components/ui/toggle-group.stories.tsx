import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta = {
	title: "shadcn/ToggleGroup",
	component: ToggleGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ToggleGroup type="single">
			<ToggleGroupItem value="a">A</ToggleGroupItem>
			<ToggleGroupItem value="b">B</ToggleGroupItem>
			<ToggleGroupItem value="c">C</ToggleGroupItem>
		</ToggleGroup>
	),
};

export const Multiple: Story = {
	render: () => (
		<ToggleGroup type="multiple">
			<ToggleGroupItem value="bold">B</ToggleGroupItem>
			<ToggleGroupItem value="italic">I</ToggleGroupItem>
			<ToggleGroupItem value="underline">U</ToggleGroupItem>
		</ToggleGroup>
	),
};








