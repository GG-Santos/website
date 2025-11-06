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
} from "@/components/ui/table";
import { Badge } from "@shadcn/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shadcn/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function RoadmapManagementPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    undefined,
  );

  const { data, isLoading, refetch } = trpc.roadmap.getAll.useQuery({
    limit: 50,
    offset: 0,
    published: publishedFilter,
  });

  const deleteMutation = trpc.roadmap.delete.useMutation({
    onSuccess: () => {
      toast.success("Roadmap item deleted successfully");
      refetch();
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete roadmap item");
    },
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  return (
    <>
      <SiteHeader title="Roadmap Management" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Roadmap Items</h1>
            <p className="text-muted-foreground">
              Manage your roadmap and development timeline
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
              <Link href="/admin/roadmap/new">
                <Plus className="mr-2 h-4 w-4" />
                New Item
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Roadmap Items</CardTitle>
            <CardDescription>
              {data?.total || 0} total items
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p>Loading...</p>
              </div>
            ) : !data?.items.length ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  No roadmap items found
                </p>
                <Button asChild>
                  <Link href="/admin/roadmap/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Item
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gallery Images</TableHead>
                    <TableHead>Video</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/roadmap/${item.id}`}
                          className="hover:underline"
                        >
                          {item.title}
                        </Link>
                      </TableCell>
                      <TableCell>{item.author.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.published ? "default" : "secondary"}
                        >
                          {item.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.gallery.length} images</TableCell>
                      <TableCell>
                        {item.youtubeVideoId ? (
                          <Badge variant="outline">Yes</Badge>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </TableCell>
                      <TableCell>{item.views}</TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/roadmap/${item.slug}`)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/roadmap/${item.id}`)
                              }
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

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                roadmap item.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
