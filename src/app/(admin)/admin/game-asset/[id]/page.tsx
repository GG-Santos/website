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

const gameAssetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string().url("Image must be a valid URL"),
  description: z.string().optional().nullable().refine(
    (val) => {
      if (!val) return true;
      const words = val.trim().split(/\s+/).filter(Boolean);
      return words.length <= 100;
    },
    { message: "Description must be 100 words or less" }
  ),
  blogLink: z.string().optional().nullable().refine(
    (val) => {
      if (!val || val.trim() === "") return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Blog link must be a valid URL" }
  ),
  difficulty: z.number().int().min(1).max(5),
  pinned: z.boolean().default(false),
  category: z.string().min(1, "Category is required"),
  type: z.string().optional().nullable(),
  published: z.boolean().default(true),
});

type GameAssetForm = z.input<typeof gameAssetSchema>;

export default function GameAssetEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { data: asset, isLoading } = trpc.gameAsset.getById.useQuery(
    { id },
    { enabled: !isNew },
  );

  const form = useForm<GameAssetForm>({
    resolver: zodResolver(gameAssetSchema) as any,
    defaultValues: {
      title: "",
      image: "",
      description: "",
      blogLink: "",
      difficulty: 1,
      pinned: false,
      category: "",
      type: "",
      published: true,
    },
  });

  const descriptionValue = form.watch("description") || "";
  const wordCount = descriptionValue.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (asset && !isNew) {
      form.reset({
        title: asset.title,
        image: asset.image,
        description: asset.description || "",
        blogLink: asset.blogLink || "",
        difficulty: asset.difficulty,
        pinned: asset.pinned,
        category: asset.category,
        type: asset.type || "",
        published: asset.published,
      });
      setImagePreview(asset.image);
    }
  }, [asset, isNew, form]);

  const createMutation = trpc.gameAsset.create.useMutation({
    onSuccess: () => {
      toast.success("Game asset created successfully");
      router.push("/admin/game-asset");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create game asset");
    },
  });

  const updateMutation = trpc.gameAsset.update.useMutation({
    onSuccess: () => {
      toast.success("Game asset updated successfully");
      router.push("/admin/game-asset");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update game asset");
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

  const onSubmit = (data: GameAssetForm) => {
    const submitData = {
      ...data,
      description: data.description && data.description.trim() !== "" ? data.description.trim() : null,
      blogLink: data.blogLink && data.blogLink.trim() !== "" ? data.blogLink.trim() : null,
      type: data.type && data.type.trim() !== "" ? data.type.trim() : null,
    };

    if (isNew) {
      createMutation.mutate(submitData);
    } else {
      updateMutation.mutate({ id, data: submitData });
    }
  };

  if (isLoading && !isNew) {
    return (
      <>
        <SiteHeader title={isNew ? "New Game Asset" : "Edit Game Asset"} />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center py-12">
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader title={isNew ? "Create Game Asset" : "Edit Game Asset"} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/game-asset">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isNew ? "Create New Game Asset" : "Edit Game Asset"}
            </h1>
            <p className="text-muted-foreground">
              {isNew
                ? "Fill in the details to create a new game asset"
                : "Update the game asset details"}
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
                      Provide the basic details for the game asset
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
                            <Input placeholder="Character #001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="Character" {...field} />
                          </FormControl>
                          <FormDescription>
                            The category of this asset (e.g., Character, Item, etc.)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Rare, Common, etc." {...field} value={field.value || ""} />
                          </FormControl>
                          <FormDescription>
                            Optional type classification for this asset
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Difficulty level from 1 to 5
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={6}
                              placeholder="Describe this character (max 100 words)..."
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                const words = value.trim().split(/\s+/).filter(Boolean);
                                if (words.length <= 100) {
                                  field.onChange(value);
                                } else {
                                  toast.error("Description cannot exceed 100 words");
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Character description (max 100 words). {wordCount}/100 words
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="blogLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blog Link (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/blog/post"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            URL for the "Read Blog" button in the asset dialog
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
                      name="pinned"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Pinned</FormLabel>
                            <FormDescription>
                              Pinned assets appear on the homepage preview
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

                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Published</FormLabel>
                            <FormDescription>
                              Published assets are visible to all users
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
                onClick={() => router.push("/admin/game-asset")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createMutation.isPending || updateMutation.isPending
                }
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isNew
                    ? "Create Asset"
                    : "Update Asset"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
