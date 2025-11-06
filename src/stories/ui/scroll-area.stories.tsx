import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea } from "@shadcn/scroll-area";
import { Separator } from "@shadcn/separator";

const meta = {
	title: "shadcn/ScrollArea",
	component: ScrollArea,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
			<div className="space-y-4">
				{Array.from({ length: 50 }).map((_, i) => (
					<div key={i}>
						<div className="text-sm">Item {i + 1}</div>
						{i !== 49 && <Separator className="my-2" />}
					</div>
				))}
			</div>
		</ScrollArea>
	),
};

