"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@shadcn/form";
import { Input } from "@shadcn/input";
import { Switch } from "@shadcn/switch";
import { Textarea } from "@shadcn/textarea";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SiteHeader } from "@/components/layouts/app/site-header";
import {
  backgroundImageSchema,
  footerLinkSchema,
  homeSectionsSchema,
  menuItemSchema,
  pageKeySchema,
} from "@/lib/site-settings/schema";
import { trpc } from "@/lib/trpc/client";

const headerFormSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  menuItems: z
    .array(menuItemSchema)
    .min(1, "At least one menu item is required"),
});

type HeaderFormValues = z.infer<typeof headerFormSchema>;

const heroBackgroundFormSchema = z.object({
  backgroundImage: backgroundImageSchema,
});

type HeroBackgroundFormValues = z.infer<typeof heroBackgroundFormSchema>;

const pageFormSchema = z.record(
  pageKeySchema,
  z.object({
    title: z.string().min(1),
    subtitle: z.string(),
  })
);

type PageFormValues = z.infer<typeof pageFormSchema>;

const footerFormSchema = z.object({
  text: z.string().min(1, "Footer text is required"),
  links: z
    .array(footerLinkSchema)
    .min(1, "At least one footer link is required"),
});

type FooterFormValues = z.infer<typeof footerFormSchema>;

const sectionsFormSchema = homeSectionsSchema;
type SectionsFormValues = z.infer<typeof sectionsFormSchema>;

const sectionLabels: Record<keyof SectionsFormValues, string> = {
  about: "About Section",
  features: "Features Section",
  collection: "Collection Section",
  investors: "Investor Section",
  blog: "Blog Section",
};

const sectionDescriptions: Record<keyof SectionsFormValues, string> = {
  about: "Controls the About segment with testimonials and story.",
  features: "Toggles the features carousel sourced from game objectives.",
  collection: "Shows the collection preview of game assets.",
  investors: "Displays the investor logos section.",
  blog: "Shows the latest blog posts preview.",
};

const pageOrder: z.infer<typeof pageKeySchema>[] = [
  "home",
  "about",
  "collection",
  "roadmap",
  "blog",
  "contact",
];

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Settings page requires multiple form states
export default function SiteSettingsPage() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.siteSettings.get.useQuery();

  const headerForm = useForm<HeaderFormValues>({
    resolver: zodResolver(headerFormSchema),
    defaultValues: {
      siteName: "",
      menuItems: [{ label: "", href: "/" }],
    },
  });

  const {
    fields: menuFields,
    append: appendMenu,
    remove: removeMenu,
  } = useFieldArray({
    control: headerForm.control,
    name: "menuItems",
  });

  const heroBackgroundForm = useForm<HeroBackgroundFormValues>({
    resolver: zodResolver(heroBackgroundFormSchema),
    defaultValues: {
      backgroundImage: "",
    },
  });

  const pageForm = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      home: { title: "", subtitle: "" },
      about: { title: "", subtitle: "" },
      collection: { title: "", subtitle: "" },
      roadmap: { title: "", subtitle: "" },
      blog: { title: "", subtitle: "" },
      contact: { title: "", subtitle: "" },
    },
  });

  const footerForm = useForm<FooterFormValues>({
    resolver: zodResolver(footerFormSchema),
    defaultValues: {
      text: "",
      links: [{ label: "", href: "/" }],
    },
  });

  const {
    fields: footerLinkFields,
    append: appendFooterLink,
    remove: removeFooterLink,
  } = useFieldArray({
    control: footerForm.control,
    name: "links",
  });

  const sectionsForm = useForm<SectionsFormValues>({
    resolver: zodResolver(sectionsFormSchema),
    defaultValues: {
      about: true,
      features: true,
      collection: true,
      investors: true,
      blog: true,
    },
  });

  const [heroPreview, setHeroPreview] = useState<string>("");
  const [heroUploading, setHeroUploading] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);

  const headerMutation = trpc.siteSettings.updateHeader.useMutation({
    onSuccess: (data) => {
      toast.success("Header updated successfully");
      const safeMenuItems = (data.menuItems || []).map((item) => ({
        label: item.label ?? "",
        href: item.href ?? "",
      }));
      headerForm.reset({
        siteName: data.siteName ?? "",
        menuItems: safeMenuItems.length
          ? safeMenuItems
          : [{ label: "", href: "" }],
      });
      utils.siteSettings.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update header");
    },
  });

  const heroBackgroundMutation =
    trpc.siteSettings.updateHeroBackground.useMutation({
      onSuccess: (data) => {
        toast.success("Hero background updated successfully");
        heroBackgroundForm.reset({
          backgroundImage: data.backgroundImage ?? "",
        });
        setHeroPreview(data.backgroundImage ?? "");
        utils.siteSettings.get.invalidate();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update hero background");
      },
    });

  const pageMutation = trpc.siteSettings.updatePages.useMutation({
    onSuccess: (data) => {
      toast.success("Page titles updated successfully");
      const safePages = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          {
            title: value?.title ?? "",
            subtitle: value?.subtitle ?? "",
          },
        ])
      ) as PageFormValues;
      pageForm.reset(safePages);
      utils.siteSettings.get.invalidate();
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to update page titles";
      toast.error(errorMessage);
    },
  });

  const footerMutation = trpc.siteSettings.updateFooter.useMutation({
    onSuccess: (data) => {
      toast.success("Footer updated successfully");
      const safeFooterLinks = (data.links || []).map((link) => ({
        label: link.label ?? "",
        href: link.href ?? "",
      }));
      footerForm.reset({
        text: data.text ?? "",
        links: safeFooterLinks.length
          ? safeFooterLinks
          : [{ label: "", href: "" }],
      });
      utils.siteSettings.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update footer");
    },
  });

  const sectionsMutation = trpc.siteSettings.updateHomeSections.useMutation({
    onSuccess: (data) => {
      toast.success("Homepage sections updated successfully");
      sectionsForm.reset(data);
      utils.siteSettings.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update homepage sections");
    },
  });

  useEffect(() => {
    if (!settings) {
      return;
    }

    const safeMenuItems = (settings.header.menuItems || []).map((item) => ({
      label: item.label ?? "",
      href: item.href ?? "",
    }));

    headerForm.reset({
      siteName: settings.header.siteName ?? "",
      menuItems: safeMenuItems.length
        ? safeMenuItems
        : [{ label: "", href: "" }],
    });

    heroBackgroundForm.reset({
      backgroundImage: settings.heroBackgroundImage ?? "",
    });

    setHeroPreview(settings.heroBackgroundImage ?? "");

    const safePages = Object.fromEntries(
      Object.entries(settings.pages).map(([key, value]) => [
        key,
        {
          title: value?.title ?? "",
          subtitle: value?.subtitle ?? "",
        },
      ])
    ) as PageFormValues;

    pageForm.reset(safePages);

    const safeFooterLinks = (settings.footer.links || []).map((link) => ({
      label: link.label ?? "",
      href: link.href ?? "",
    }));

    footerForm.reset({
      text: settings.footer.text ?? "",
      links: safeFooterLinks.length
        ? safeFooterLinks
        : [{ label: "", href: "" }],
    });

    sectionsForm.reset(settings.homeSections);
  }, [
    settings,
    headerForm,
    heroBackgroundForm,
    pageForm,
    footerForm,
    sectionsForm,
  ]);

  const pageEntries = useMemo(() => pageOrder, []);

  const MAX_IMAGE_SIZE_MB = 5;
  const BYTES_PER_KB = 1024;
  const KB_PER_MB = 1024;
  const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * KB_PER_MB * BYTES_PER_KB;

  const handleHeroImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(`Image size must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    setHeroUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hero");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      heroBackgroundForm.setValue("backgroundImage", data.url, {
        shouldValidate: true,
      });
      setHeroPreview(data.url);
      toast.success("Hero image uploaded");
    } catch {
      toast.error("Failed to upload hero image");
    } finally {
      setHeroUploading(false);
      if (heroFileInputRef.current) {
        heroFileInputRef.current.value = "";
      }
    }
  };

  const clearHeroImage = () => {
    heroBackgroundForm.setValue("backgroundImage", "", {
      shouldValidate: true,
    });
    setHeroPreview("");
    if (heroFileInputRef.current) {
      heroFileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (
    file: File,
    folder: string,
    setValue: (url: string) => void,
    setPreview: (url: string) => void,
    setUploading: (uploading: boolean) => void,
    fileInputRef?: React.RefObject<HTMLInputElement>,
  ) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(`Image size must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setValue(data.url);
      setPreview(data.url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef?.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <SiteHeader title="Site Settings" />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6 lg:p-8">
        {isLoading || !settings ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p>Loading site settings...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[1fr_400px]">
              <div className="space-y-6">
                <Form {...pageForm}>
                  <form
                    className="space-y-6"
                    onSubmit={pageForm.handleSubmit((values) => {
                      pageMutation.mutate(
                        Object.entries(values).map(([key, value]) => ({
                          key: key as z.infer<typeof pageKeySchema>,
                          title: value.title,
                          subtitle: value.subtitle,
                        }))
                      );
                    })}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Page Titles &amp; Subtitles</CardTitle>
                        <CardDescription>
                          Customize the banner titles and subtitles for each
                          page. The Home page title and subtitle are displayed
                          in the hero section.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          {pageEntries.map((key) => (
                            <div
                              className="space-y-4 rounded-lg border p-4"
                              key={key}
                            >
                              <FormField
                                control={pageForm.control}
                                name={`${key}.title` as const}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="capitalize">
                                      {key === "home"
                                        ? "Hero Title (Home)"
                                        : `${key} Page Title`}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Page title"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={pageForm.control}
                                name={`${key}.subtitle` as const}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="capitalize">
                                      {key === "home"
                                        ? "Hero Subtitle (Home)"
                                        : `${key} Subtitle`}
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Optional subtitle"
                                        rows={2}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                        </div>
                        <Button disabled={pageMutation.isPending} type="submit">
                          {pageMutation.isPending
                            ? "Saving..."
                            : "Save Page Titles"}
                        </Button>
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </div>

              <div className="space-y-6">
                <Form {...heroBackgroundForm}>
                  <form
                    className="space-y-6"
                    onSubmit={heroBackgroundForm.handleSubmit((values) =>
                      heroBackgroundMutation.mutate(values)
                    )}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Hero Background Image</CardTitle>
                        <CardDescription>
                          Upload or enter image URL
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {heroPreview ? (
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                            <Image
                              alt="Hero background preview"
                              className="object-cover"
                              fill
                              src={heroPreview}
                            />
                            <Button
                              className="absolute top-2 right-2"
                              onClick={clearHeroImage}
                              size="icon"
                              type="button"
                              variant="destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed">
                            <div className="text-center">
                              <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                              <p className="mb-2 text-muted-foreground text-sm">
                                Upload an image
                              </p>
                              <input
                                accept="image/*"
                                className="hidden"
                                disabled={heroUploading}
                                id="hero-image-upload"
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  if (file) {
                                    handleHeroImageUpload(file);
                                  }
                                }}
                                ref={heroFileInputRef}
                                type="file"
                              />
                              <Button
                                disabled={heroUploading}
                                onClick={() =>
                                  heroFileInputRef.current?.click()
                                }
                                type="button"
                                variant="outline"
                              >
                                {heroUploading ? "Uploading..." : "Choose File"}
                              </Button>
                            </div>
                          </div>
                        )}
                        <FormField
                          control={heroBackgroundForm.control}
                          name="backgroundImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/background.jpg"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setHeroPreview(e.target.value);
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
                        <Button
                          disabled={heroBackgroundMutation.isPending}
                          type="submit"
                        >
                          {heroBackgroundMutation.isPending
                            ? "Saving..."
                            : "Save Hero Background"}
                        </Button>
                      </CardContent>
                    </Card>
                  </form>
                </Form>

                <Form {...headerForm}>
                  <form
                    className="space-y-6"
                    onSubmit={headerForm.handleSubmit((values) =>
                      headerMutation.mutate(values)
                    )}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Header &amp; Navigation</CardTitle>
                        <CardDescription>
                          Update the site name and navigation menu text.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={headerForm.control}
                          name="siteName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Site Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Underdogs Studios"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Displayed in the header logo area.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-5">
                          <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-lg">
                              Menu Items
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              Update navigation text and links. Items are
                              displayed in order.
                            </p>
                          </div>
                          <div className="flex flex-col gap-4">
                            {menuFields.map((field, index) => (
                              <div
                                className="grid gap-4 rounded-lg border border-border/80 p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end"
                                key={field.id}
                              >
                                <FormField
                                  control={headerForm.control}
                                  name={`menuItems.${index}.label`}
                                  render={({ field: itemField }) => (
                                    <FormItem>
                                      <FormLabel>Label</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Home"
                                          {...itemField}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={headerForm.control}
                                  name={`menuItems.${index}.href`}
                                  render={({ field: itemField }) => (
                                    <FormItem>
                                      <FormLabel>Link</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="/home"
                                          {...itemField}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <div className="flex justify-end md:justify-start">
                                  <Button
                                    disabled={menuFields.length <= 1}
                                    onClick={() => removeMenu(index)}
                                    type="button"
                                    variant="ghost"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ))}
                            <Button
                              className="self-start"
                              onClick={() =>
                                appendMenu({ label: "New Item", href: "/" })
                              }
                              type="button"
                              variant="outline"
                            >
                              Add Menu Item
                            </Button>
                          </div>
                        </div>
                        <Button
                          disabled={headerMutation.isPending}
                          type="submit"
                        >
                          {headerMutation.isPending
                            ? "Saving..."
                            : "Save Header"}
                        </Button>
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </div>
            </div>

            <Form {...sectionsForm}>
              <form
                className="space-y-6"
                onSubmit={sectionsForm.handleSubmit((values) =>
                  sectionsMutation.mutate(values)
                )}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Homepage Sections</CardTitle>
                    <CardDescription>
                      Enable or disable sections on the homepage (hero and
                      footer are always visible).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.keys(sectionLabels).map((key) => {
                      const sectionKey = key as keyof SectionsFormValues;
                      return (
                        <FormField
                          control={sectionsForm.control}
                          key={sectionKey}
                          name={sectionKey}
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                              <div className="space-y-1">
                                <FormLabel>
                                  {sectionLabels[sectionKey]}
                                </FormLabel>
                                <FormDescription>
                                  {sectionDescriptions[sectionKey]}
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
                      );
                    })}
                  </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-4">
                  <Button disabled={sectionsMutation.isPending} type="submit">
                    {sectionsMutation.isPending
                      ? "Saving..."
                      : "Save Section Visibility"}
                  </Button>
                </div>
              </form>
            </Form>

            <Form {...footerForm}>
              <form
                className="space-y-6"
                onSubmit={footerForm.handleSubmit((values) =>
                  footerMutation.mutate(values)
                )}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Footer Content</CardTitle>
                    <CardDescription>
                      Control the footer text and quick links displayed across
                      the site.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={footerForm.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Footer Text</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="© 2025 Underdogs Studio"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This text appears in the footer and navigation
                            overlay.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-5">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold text-lg">Footer Links</h3>
                        <p className="text-muted-foreground text-sm">
                          Update the text and destination of footer links.
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        {footerLinkFields.map((field, index) => (
                          <div
                            className="grid gap-4 rounded-lg border border-border/80 p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end"
                            key={field.id}
                          >
                            <FormField
                              control={footerForm.control}
                              name={`links.${index}.label`}
                              render={({ field: itemField }) => (
                                <FormItem>
                                  <FormLabel>Label</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Roadmap"
                                      {...itemField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={footerForm.control}
                              name={`links.${index}.href`}
                              render={({ field: itemField }) => (
                                <FormItem>
                                  <FormLabel>Link</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="/roadmap"
                                      {...itemField}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-end md:justify-start">
                              <Button
                                disabled={footerLinkFields.length <= 1}
                                onClick={() => removeFooterLink(index)}
                                type="button"
                                variant="ghost"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          className="self-start"
                          onClick={() =>
                            appendFooterLink({ label: "New Link", href: "/" })
                          }
                          type="button"
                          variant="outline"
                        >
                          Add Footer Link
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-4">
                  <Button disabled={footerMutation.isPending} type="submit">
                    {footerMutation.isPending ? "Saving..." : "Save Footer"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </>
  );
}
