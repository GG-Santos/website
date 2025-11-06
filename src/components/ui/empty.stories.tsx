import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Empty } from "./empty";

const meta = {
	title: "shadcn/Empty",
	component: Empty,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Empty className="w-[350px]">
			<div className="text-center">
				<h3 className="text-lg font-semibold">No results found</h3>
				<p className="text-muted-foreground text-sm mt-2">
					Try adjusting your search to find what you're looking for.
				</p>
				<Button className="mt-4" variant="outline">
					Clear filters
				</Button>
			</div>
		</Empty>
	),
};








