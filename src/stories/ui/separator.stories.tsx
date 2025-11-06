import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@shadcn/separator";

const meta = {
	title: "shadcn/Separator",
	component: Separator,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-full max-w-xs space-y-4">
			<div className="space-y-1">
				<h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
				<p className="text-muted-foreground text-sm">
					An open-source UI component library.
				</p>
			</div>
			<Separator />
			<div className="flex h-5 items-center space-x-4 text-sm">
				<div>Blog</div>
				<Separator orientation="vertical" />
				<div>Docs</div>
				<Separator orientation="vertical" />
				<div>Source</div>
			</div>
		</div>
	),
};

