import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";
import { Button } from "./button";
import { Toaster } from "./sonner";

const meta = {
	title: "shadcn/Sonner",
	component: Toaster,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div>
			<Toaster />
			<Button onClick={() => toast("Event has been created")}>
				Show Toast
			</Button>
		</div>
	),
};

export const WithDescription: Story = {
	render: () => (
		<div>
			<Toaster />
			<Button
				onClick={() =>
					toast("Event has been created", {
						description: "Sunday, December 03, 2023 at 9:00 AM",
					})
				}
			>
				Show Toast with Description
			</Button>
		</div>
	),
};

export const Success: Story = {
	render: () => (
		<div>
			<Toaster />
			<Button onClick={() => toast.success("Event has been created")}>
				Show Success
			</Button>
		</div>
	),
};

export const Error: Story = {
	render: () => (
		<div>
			<Toaster />
			<Button onClick={() => toast.error("Event could not be created")}>
				Show Error
			</Button>
		</div>
	),
};








