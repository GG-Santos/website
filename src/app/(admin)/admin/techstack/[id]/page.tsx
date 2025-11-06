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
import { Switch } from "@/components/ui/switch";
import { SiteHeader } from "@/components/layouts/app/site-header";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const techstackSchema = z.object({
  name: z.string().optional(),
  logo: z.string().url("Logo must be a valid URL"),
  url: z.union([z.string().url("URL must be a valid URL"), z.literal("")]).optional(),
  published: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

type TechstackForm = z.input<typeof techstackSchema>;

export default function TechstackEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const { data: techstack, isLoading } = trpc.techstack.getById.useQuery(
    { id },
    { enabled: !isNew },
  );

  const form = useForm<TechstackForm>({
    resolver: zodResolver(techstackSchema),
    defaultValues: {
      name: "",
      logo: "",
      url: "",
      published: true,
      order: 0,
    },
  });

  useEffect(() => {
    if (techstack && !isNew) {
      form.reset({
        name: techstack.name || "",
        logo: techstack.logo,
        url: techstack.url || "",
        published: techstack.published,
        order: techstack.order,
      });
      setImagePreview(techstack.logo);
    }
  }, [techstack, isNew, form]);

  const createMutation = trpc.techstack.create.useMutation({
    onSuccess: () => {
      toast.success("Techstack item created successfully");
      router.push("/admin/techstack");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create techstack item");
    },
  });

  const updateMutation = trpc.techstack.update.useMutation({
    onSuccess: () => {
      toast.success("Techstack item updated successfully");
      router.push("/admin/techstack");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update techstack item");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      formData.append("folder", "techstack");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      form.setValue("logo", data.url);
      setImagePreview(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: TechstackForm) => {
    if (isNew) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id, data });
    }
  };

  if (isLoading && !isNew) {
    return (
      <>
        <SiteHeader title={isNew ? "New Techstack" : "Edit Techstack"} />
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
      <SiteHeader title={isNew ? "Create Techstack" : "Edit Techstack"} />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/techstack">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isNew ? "Create New Techstack" : "Edit Techstack"}
            </h1>
            <p className="text-muted-foreground">
              {isNew
                ? "Fill in the details to create a new techstack logo"
                : "Update the techstack details"}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[1fr_400px]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Techstack Information</CardTitle>
                    <CardDescription>
                      Provide the details for the techstack item
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Techstack Partner" {...field} />
                          </FormControl>
                          <FormDescription>
                            Optional name for the techstack/partner
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional link URL for the techstack logo
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
                    <CardTitle>Logo Image</CardTitle>
                    <CardDescription>Upload or enter image URL</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {imagePreview ? (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImagePreview("");
                            form.setValue("logo", "");
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
                            Upload a logo
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                            id="logo-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            disabled={uploading}
                            onClick={() =>
                              document.getElementById("logo-upload")?.click()
                            }
                          >
                            {uploading ? "Uploading..." : "Choose File"}
                          </Button>
                        </div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://example.com/logo.png"
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
                              Published techstack items are visible on the website
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
                onClick={() => router.push("/admin/techstack")}
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
                    ? "Create Techstack"
                    : "Update Techstack"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}

