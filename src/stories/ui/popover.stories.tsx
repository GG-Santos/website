import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "@shadcn/popover";

const meta = {
	title: "shadcn/Popover",
	component: Popover,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline">Open Popover</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="grid gap-4">
					<h4 className="font-medium leading-none">Dimensions</h4>
					<p className="text-muted-foreground text-sm">
						Set the dimensions for the layer.
					</p>
				</div>
			</PopoverContent>
		</Popover>
	),
};

