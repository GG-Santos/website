import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "@shadcn/avatar";
import { Button } from "@shadcn/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@shadcn/hover-card";

const meta = {
	title: "shadcn/HoverCard",
	component: HoverCard,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Button variant="link">@nextjs</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="flex justify-between space-x-4">
					<Avatar>
						<AvatarImage src="https://github.com/vercel.png" />
						<AvatarFallback>VC</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						<h4 className="text-sm font-semibold">@nextjs</h4>
						<p className="text-sm">
							The React Framework – created and maintained by @vercel.
						</p>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	),
};

