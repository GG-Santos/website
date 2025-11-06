"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SiteHeader } from "@/components/layouts/app/site-header";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const testimonialSchema = z.object({
  quote: z.string().min(1, "Quote is required"),
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  image: z.string().url("Image must be a valid URL"),
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

type TestimonialForm = z.input<typeof testimonialSchema>;

export default function TestimonialEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { data: testimonial, isLoading } = trpc.testimonial.getById.useQuery(
    { id },
    { enabled: !isNew },
  );

  const { data: countData } = trpc.testimonial.getCount.useQuery();

  const form = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      quote: "",
      name: "",
      designation: "",
      image: "",
      published: true,
      order: 0,
    },
  });

  useEffect(() => {
    if (testimonial && !isNew) {
      form.reset({
        quote: testimonial.quote,
        name: testimonial.name,
        designation: testimonial.designation,
        image: testimonial.image,
        published: testimonial.published,
        order: testimonial.order,
      });
      setImagePreview(testimonial.image);
    }
  }, [testimonial, isNew, form]);

  const createMutation = trpc.testimonial.create.useMutation({
    onSuccess: () => {
      toast.success("Testimonial created successfully");
      router.push("/admin/testimonial");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create testimonial");
    },
  });

  const updateMutation = trpc.testimonial.update.useMutation({
    onSuccess: () => {
      toast.success("Testimonial updated successfully");
      router.push("/admin/testimonial");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update testimonial");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      form.setValue("image", data.url);
      setImagePreview(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: TestimonialForm) => {
    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id, data });
    }
  };

  if (isLoading && !isNew) {
    return (
      <>
        <SiteHeader title={isNew ? "New Testimonial" : "Edit Testimonial"} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center py-12">
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  const maxReached = isNew && countData && countData.count >= (countData.max || 8);

  return (
    <>
      <SiteHeader title={isNew ? "Create Testimonial" : "Edit Testimonial"} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/testimonial">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isNew ? "Create New Testimonial" : "Edit Testimonial"}
            </h1>
            <p className="text-muted-foreground">
              {isNew
                ? "Fill in the details to create a new testimonial"
                : "Update the testimonial details"}
            </p>
          </div>
        </div>

        {maxReached && (
          <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                ⚠️ Maximum limit of {countData?.max || 8} testimonials reached. Delete one before creating a new one.
              </p>
            </CardContent>
          </Card>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[1fr_400px]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Testimonial Information</CardTitle>
                    <CardDescription>
                      Provide the details for the testimonial
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Underdogs Studios" {...field} />
                          </FormControl>
                          <FormDescription>
                            The name of the person or team giving the testimonial
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input placeholder="Development Team" {...field} />
                          </FormControl>
                          <FormDescription>
                            The role or title of the person/team
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quote"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quote</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={5}
                              placeholder="Enter the testimonial quote..."
                            />
                          </FormControl>
                          <FormDescription>
                            The testimonial quote or statement
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Order</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Lower numbers appear first (default: 0)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                    <CardDescription>Upload or enter image URL</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {imagePreview ? (
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImagePreview("");
                            form.setValue("image", "");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center aspect-square border-2 border-dashed rounded-lg">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload an image
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                            id="image-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploading}
                            onClick={() =>
                              document.getElementById("image-upload")?.click()
                            }
                          >
                            {uploading ? "Uploading..." : "Choose File"}
                          </Button>
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://example.com/image.jpg"
                              onChange={(e) => {
                                field.onChange(e);
                                setImagePreview(e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Or paste an image URL directly
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Publish Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Published</FormLabel>
                            <FormDescription>
                              Published testimonials are visible on the website
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/testimonial")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  maxReached
                }
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isNew
                    ? "Create Testimonial"
                    : "Update Testimonial"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

