import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@shadcn/label";
import { Switch } from "@shadcn/switch";

const meta = {
	title: "shadcn/Switch",
	component: Switch,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <Switch />,
};

export const WithLabel: Story = {
	render: () => (
		<div className="flex items-center space-x-2">
			<Switch id="airplane-mode" />
			<Label htmlFor="airplane-mode">Airplane Mode</Label>
		</div>
	),
};

export const Checked: Story = {
	render: () => <Switch defaultChecked />,
};

export const Disabled: Story = {
	render: () => <Switch disabled />,
};

