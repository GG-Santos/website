"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/table";
import { Badge } from "@shadcn/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shadcn/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/layouts/app/site-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shadcn/alert-dialog";
import { toast } from "sonner";
import Image from "next/image";

export default function InvestorManagementPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    undefined,
  );

  const { data: investors, isLoading, refetch } = trpc.investor.getAll.useQuery();

  const filteredInvestors = investors?.filter((investor) => {
    if (publishedFilter === undefined) return true;
    return investor.published === publishedFilter;
  });

  const deleteMutation = trpc.investor.delete.useMutation({
    onSuccess: () => {
      toast.success("Investor deleted successfully");
      refetch();
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete investor");
    },
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  return (
    <>
      <SiteHeader title="Investor Management" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Investors</h1>
            <p className="text-muted-foreground">
              Manage investor logos for the Techstack section
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={publishedFilter === undefined ? "default" : "outline"}
              onClick={() => setPublishedFilter(undefined)}
            >
              All
            </Button>
            <Button
              variant={publishedFilter === true ? "default" : "outline"}
              onClick={() => setPublishedFilter(true)}
            >
              Published
            </Button>
            <Button
              variant={publishedFilter === false ? "default" : "outline"}
              onClick={() => setPublishedFilter(false)}
            >
              Drafts
            </Button>
            <Button asChild>
              <Link href="/admin/investor/new">
                <Plus className="mr-2 h-4 w-4" />
                New Investor
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Investors</CardTitle>
            <CardDescription>
              {filteredInvestors?.length || 0} total investors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p>Loading...</p>
              </div>
            ) : !filteredInvestors?.length ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  No investors found
                </p>
                <Button asChild>
                  <Link href="/admin/investor/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Investor
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Logo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvestors.map((investor) => (
                    <TableRow key={investor.id}>
                      <TableCell>
                        <div className="relative h-16 w-24 overflow-hidden rounded">
                          <Image
                            src={investor.logo}
                            alt={investor.name || "Investor logo"}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {investor.name || "—"}
                      </TableCell>
                      <TableCell>
                        {investor.url ? (
                          <a
                            href={investor.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate max-w-xs block"
                          >
                            {investor.url}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {investor.order}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {investor.published ? (
                          <Badge variant="default">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/investor/${investor.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(investor.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              investor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

