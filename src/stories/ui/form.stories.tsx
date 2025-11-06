import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@shadcn/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@shadcn/form";
import { Input } from "@shadcn/input";

const meta = {
	title: "shadcn/Form",
	component: Form,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Example: Story = {
	render: () => (
		<div className="w-[350px] space-y-4">
			<FormItem>
				<FormLabel>Username</FormLabel>
				<FormControl>
					<Input placeholder="shadcn" />
				</FormControl>
				<FormDescription>This is your public display name.</FormDescription>
				<FormMessage />
			</FormItem>
			<Button>Submit</Button>
		</div>
	),
};

