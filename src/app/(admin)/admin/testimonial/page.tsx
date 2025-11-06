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

export default function TestimonialManagementPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(
    undefined,
  );

  const { data: testimonials, isLoading, refetch } = trpc.testimonial.getAll.useQuery();
  const { data: countData } = trpc.testimonial.getCount.useQuery();
  const maxCount = countData?.max || 8;

  const filteredTestimonials = testimonials?.filter((testimonial) => {
    if (publishedFilter === undefined) return true;
    return testimonial.published === publishedFilter;
  });

  const deleteMutation = trpc.testimonial.delete.useMutation({
    onSuccess: () => {
      toast.success("Testimonial deleted successfully");
      refetch();
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete testimonial");
    },
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate({ id: deleteId });
    }
  };

  const canCreate = !countData || countData.count < maxCount;

  return (
    <>
      <SiteHeader title="Testimonials Management" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
            <p className="text-muted-foreground">
              Manage testimonials (max {maxCount}) - {countData?.count || 0}/{maxCount} used
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
            <Button asChild disabled={!canCreate}>
              <Link href="/admin/testimonial/new">
                <Plus className="mr-2 h-4 w-4" />
                New Testimonial
              </Link>
            </Button>
          </div>
        </div>

        {!canCreate && (
          <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ Maximum limit of {maxCount} testimonials reached. Delete one before creating a new one.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>
              {filteredTestimonials?.length || 0} total testimonials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p>Loading...</p>
              </div>
            ) : !filteredTestimonials?.length ? (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">
                  No testimonials found
                </p>
                <Button asChild disabled={!canCreate}>
                  <Link href="/admin/testimonial/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Testimonial
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Quote Preview</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTestimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <div className="relative h-16 w-16 overflow-hidden rounded-full">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {testimonial.name}
                      </TableCell>
                      <TableCell>{testimonial.designation}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate text-sm text-muted-foreground">
                          {testimonial.quote}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {testimonial.order}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {testimonial.published ? (
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
                              onClick={() => router.push(`/admin/testimonial/${testimonial.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(testimonial.id)}
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
              testimonial.
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

