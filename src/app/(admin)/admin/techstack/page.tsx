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

export default function TechstackManagementPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    undefined,
  );

  const { data: techstack, isLoading, refetch } = trpc.techstack.getAll.useQuery();

  const filteredTechstack = techstack?.filter((item) => {
    if (publishedFilter === undefined) return true;
    return item.published === publishedFilter;
  });

  const deleteMutation = trpc.techstack.delete.useMutation({
    onSuccess: () => {
      toast.success("Techstack item deleted successfully");
      refetch();
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete techstack item");
    },
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  return (
    <>
      <SiteHeader title="Techstack Management" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Techstack</h1>
            <p className="text-muted-foreground">
              Manage techstack logos for the Techstack section
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
              <Link href="/admin/techstack/new">
                <Plus className="mr-2 h-4 w-4" />
                New Techstack
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Techstack</CardTitle>
            <CardDescription>
              {filteredTechstack?.length || 0} total techstack items
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p>Loading...</p>
              </div>
            ) : !filteredTechstack?.length ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  No techstack items found
                </p>
                <Button asChild>
                  <Link href="/admin/techstack/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Techstack
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
                  {filteredTechstack.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative h-16 w-24 overflow-hidden rounded">
                          <Image
                            src={item.logo}
                            alt={item.name || "Techstack logo"}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.name || "—"}
                      </TableCell>
                      <TableCell>
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate max-w-xs block"
                          >
                            {item.url}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.order}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.published ? (
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
                              onClick={() => router.push(`/admin/techstack/${item.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(item.id)}
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
              techstack item.
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

