import type { Meta, StoryObj } from "@storybook/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@shadcn/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs";

const meta = {
	title: "shadcn/Tabs",
	component: Tabs,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tabs defaultValue="account" className="w-[400px]">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>
							Make changes to your account here.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<p className="text-sm">Account information goes here.</p>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="password">
				<Card>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>Change your password here.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<p className="text-sm">Password change form goes here.</p>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	),
};

