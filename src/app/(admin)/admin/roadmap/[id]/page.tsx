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
import { BlogEditor } from "@/components/editor/blog-editor";
import { Switch } from "@/components/ui/switch";
import { SiteHeader } from "@/components/layouts/app/site-header";
import { toast } from "sonner";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const roadmapItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().min(50, "Content must be at least 50 characters"),
  featuredImage: z.string().url("Featured image must be a valid URL"),
  gallery: z.string(),
  youtubeVideoId: z.string().optional().nullable(),
  displayDate: z.string().optional().nullable(), // Date string for display date
  published: z.boolean().default(false),
  categories: z.string(),
  tags: z.string(),
});

type RoadmapItemForm = z.infer<typeof roadmapItemSchema>;

export default function RoadmapEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [uploading, setUploading] = useState(false);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const { data: item, isLoading } = trpc.roadmap.getById.useQuery(
    { id },
    { enabled: !isNew },
  );

  const form = useForm<RoadmapItemForm>({
    resolver: zodResolver(roadmapItemSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      gallery: "",
      youtubeVideoId: "",
      published: false,
      categories: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (item && !isNew) {
      form.reset({
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        featuredImage: item.featuredImage,
        gallery: item.gallery.join(", "),
        youtubeVideoId: item.youtubeVideoId || "",
        displayDate: item.displayDate ? new Date(item.displayDate).toISOString().split('T')[0] : "",
        published: item.published,
        categories: item.categories.join(", "),
        tags: item.tags.join(", "),
      });
      setFeaturedImagePreview(item.featuredImage);
      setGalleryImages(item.gallery);
    }
  }, [item, isNew, form]);

  const createMutation = trpc.roadmap.create.useMutation({
    onSuccess: () => {
      toast.success("Roadmap item created successfully");
      router.push("/admin/roadmap");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create roadmap item");
    },
  });

  const updateMutation = trpc.roadmap.update.useMutation({
    onSuccess: () => {
      toast.success("Roadmap item updated successfully");
      router.push("/admin/roadmap");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update roadmap item");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "featured" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
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

      const { url } = await response.json();

      if (type === "featured") {
        form.setValue("featuredImage", url);
        setFeaturedImagePreview(url);
      } else {
        const newGallery = [...galleryImages, url];
        setGalleryImages(newGallery);
        form.setValue("gallery", newGallery.join(", "));
      }

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newGallery);
    form.setValue("gallery", newGallery.join(", "));
  };

  const onSubmit = (data: RoadmapItemForm) => {
    const categories = data.categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const tags = data.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const gallery = galleryImages.length > 0 ? galleryImages : 
      data.gallery.split(",").map((g) => g.trim()).filter(Boolean);

    if (isNew) {
      createMutation.mutate({
        ...data,
        gallery,
        categories,
        tags,
        youtubeVideoId: data.youtubeVideoId || null,
        displayDate: data.displayDate ? new Date(data.displayDate) : null,
      });
    } else {
      updateMutation.mutate({
        id,
        ...data,
        gallery,
        categories,
        tags,
        youtubeVideoId: data.youtubeVideoId || null,
        displayDate: data.displayDate ? new Date(data.displayDate) : null,
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // If it's already just an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    
    return null;
  };

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SiteHeader title={isNew ? "Create Roadmap Item" : "Edit Roadmap Item"} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/roadmap">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isNew ? "Create New Roadmap Item" : "Edit Roadmap Item"}
            </h1>
            <p className="text-muted-foreground">
              {isNew
                ? "Fill in the details to create a new roadmap item"
                : "Update the roadmap item details"}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[1fr_400px]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Title, slug, and excerpt for your roadmap item
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                if (isNew && !form.getValues("slug")) {
                                  form.setValue("slug", generateSlug(e.target.value));
                                }
                              }}
                              placeholder="Enter roadmap item title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="roadmap-item-slug"
                            />
                          </FormControl>
                          <FormDescription>
                            URL-friendly version of the title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Excerpt</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="Brief description of the roadmap item"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>Main content of your roadmap item</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <BlogEditor
                              content={field.value || ""}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Categories & Tags</CardTitle>
                    <CardDescription>
                      Organize your roadmap item with categories and tags
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="categories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categories</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Development, Features, Updates (comma-separated)"
                            />
                          </FormControl>
                          <FormDescription>
                            Separate multiple categories with commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Q1, Major, Release (comma-separated)"
                            />
                          </FormControl>
                          <FormDescription>
                            Separate multiple tags with commas
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
                    <CardDescription>Main image for the roadmap item</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {featuredImagePreview ? (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        <Image
                          src={featuredImagePreview}
                          alt="Featured preview"
                          fill
                          className="object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setFeaturedImagePreview("");
                            form.setValue("featuredImage", "");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center aspect-video border-2 border-dashed rounded-lg">
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Upload featured image
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "featured")}
                            disabled={uploading}
                            className="hidden"
                            id="featured-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploading}
                            onClick={() =>
                              document.getElementById("featured-upload")?.click()
                            }
                          >
                            {uploading ? "Uploading..." : "Choose File"}
                          </Button>
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="featuredImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://example.com/image.jpg"
                              onChange={(e) => {
                                field.onChange(e);
                                setFeaturedImagePreview(e.target.value);
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
                    <CardTitle>Gallery Images</CardTitle>
                    <CardDescription>Upload multiple images for the gallery</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {galleryImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {galleryImages.map((url, index) => (
                          <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                            <Image
                              src={url}
                              alt={`Gallery ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => removeGalleryImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "gallery")}
                          disabled={uploading}
                          className="hidden"
                          id="gallery-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={uploading}
                          onClick={() =>
                            document.getElementById("gallery-upload")?.click()
                          }
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {uploading ? "Uploading..." : "Add Image"}
                        </Button>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="gallery"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gallery URLs (comma-separated)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                              onChange={(e) => {
                                field.onChange(e);
                                const urls = e.target.value.split(",").map(u => u.trim()).filter(Boolean);
                                setGalleryImages(urls);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Or paste image URLs separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>YouTube Video</CardTitle>
                    <CardDescription>Optional YouTube video embed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="youtubeVideoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube URL or Video ID</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://youtube.com/watch?v=... or video ID"
                              onChange={(e) => {
                                const videoId = extractYouTubeId(e.target.value);
                                field.onChange(videoId || e.target.value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Paste a YouTube URL or video ID
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Display Date</CardTitle>
                    <CardDescription>Optional custom date to display in roadmap (defaults to creation date)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="displayDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                              onChange={(e) => {
                                field.onChange(e.target.value ? new Date(e.target.value).toISOString() : null);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Set a custom date to display in the roadmap timeline
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
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Published
                            </FormLabel>
                            <FormDescription>
                              Make this roadmap item visible to the public
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
                onClick={() => router.push("/admin/roadmap")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isNew
                    ? "Create Item"
                    : "Update Item"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
