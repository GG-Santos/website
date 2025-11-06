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
import { Textarea } from "@shadcn/textarea";
import { Upload, X, Trash2, Plus, User, Twitter, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layouts/app/site-header";
import {
  aboutHomeSectionSchema,
  aboutPageSchema,
} from "@/lib/site-settings/schema";
import { trpc } from "@/lib/trpc/client";
import { z } from "zod";

const aboutHomeSectionFormSchema = aboutHomeSectionSchema;
type AboutHomeSectionFormValues = z.infer<typeof aboutHomeSectionSchema>;

const aboutPageFormSchema = aboutPageSchema;
type AboutPageFormValues = z.infer<typeof aboutPageSchema>;

export default function AboutPage() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.siteSettings.get.useQuery();

  const aboutHomeSectionForm = useForm<AboutHomeSectionFormValues>({
    resolver: zodResolver(aboutHomeSectionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });

  const aboutPageForm = useForm<AboutPageFormValues>({
    resolver: zodResolver(aboutPageFormSchema),
    defaultValues: {
      image: "",
      team: [],
    },
  });

  const {
    fields: teamFields,
    append: appendTeam,
    remove: removeTeam,
  } = useFieldArray({
    control: aboutPageForm.control,
    name: "team",
  });

  const [aboutHomeImagePreview, setAboutHomeImagePreview] = useState<string>("");
  const [aboutHomeUploading, setAboutHomeUploading] = useState(false);

  const [aboutPageImagePreview, setAboutPageImagePreview] = useState<string>("");
  const [aboutPageUploading, setAboutPageUploading] = useState(false);

  const [teamMemberImagePreviews, setTeamMemberImagePreviews] = useState<Record<number, string>>({});
  const [teamMemberUploading, setTeamMemberUploading] = useState<Record<number, boolean>>({});

  const aboutHomeSectionMutation =
    trpc.siteSettings.updateAboutHomeSection.useMutation({
      onSuccess: (data) => {
        toast.success("About home section updated successfully");
        aboutHomeSectionForm.reset(data);
        utils.siteSettings.get.invalidate();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update about home section");
      },
    });

  const aboutPageMutation = trpc.siteSettings.updateAboutPage.useMutation({
    onSuccess: (data) => {
      toast.success("About page updated successfully");
      aboutPageForm.reset(data);
      utils.siteSettings.get.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update about page");
    },
  });

  useEffect(() => {
    if (!settings) {
      return;
    }

    aboutHomeSectionForm.reset({
      title: settings.aboutHomeSection?.title ?? "",
      description: settings.aboutHomeSection?.description ?? "",
      image: settings.aboutHomeSection?.image ?? "",
    });

    const safeTeam = (settings.aboutPage?.team || []).map((member) => ({
      name: member.name ?? "",
      title: member.title ?? "",
      imageUrl: member.imageUrl ?? "",
      socialLinks: member.socialLinks ? {
        twitter: member.socialLinks.twitter ?? "",
        facebook: member.socialLinks.facebook ?? "",
        instagram: member.socialLinks.instagram ?? "",
        youtube: member.socialLinks.youtube ?? "",
        linkedin: member.socialLinks.linkedin ?? "",
      } : undefined,
    }));

    aboutPageForm.reset({
      image: settings.aboutPage?.image ?? "",
      team: safeTeam.length ? safeTeam : [],
    });

    setAboutHomeImagePreview(settings.aboutHomeSection?.image ?? "");
    setAboutPageImagePreview(settings.aboutPage?.image ?? "");
    setTeamMemberImagePreviews(
      Object.fromEntries(
        (settings.aboutPage?.team || []).map((member, idx) => [
          idx,
          member.imageUrl ?? "",
        ])
      )
    );
  }, [
    settings,
    aboutHomeSectionForm,
    aboutPageForm,
  ]);

  const MAX_IMAGE_SIZE_MB = 5;
  const BYTES_PER_KB = 1024;
  const KB_PER_MB = 1024;
  const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * KB_PER_MB * BYTES_PER_KB;

  const handleAboutHomeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(`Image size must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    setAboutHomeUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "about");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      aboutHomeSectionForm.setValue("image", data.url);
      setAboutHomeImagePreview(data.url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setAboutHomeUploading(false);
    }
  };

  const handleAboutPageImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(`Image size must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    setAboutPageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "about");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      aboutPageForm.setValue("image", data.url);
      setAboutPageImagePreview(data.url);
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setAboutPageUploading(false);
    }
  };

  const handleTeamMemberImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(`Image size must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    setTeamMemberUploading((prev) => ({ ...prev, [index]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "team");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      aboutPageForm.setValue(`team.${index}.imageUrl`, data.url);
      setTeamMemberImagePreviews((prev) => ({ ...prev, [index]: data.url }));
      toast.success("Image uploaded successfully");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setTeamMemberUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <>
      <SiteHeader title="About Page Management" />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6 lg:p-8">
        {isLoading || !settings ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p>Loading about page settings...</p>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-6xl space-y-6">
            {/* About Home Section Form */}
            <Form {...aboutHomeSectionForm}>
              <form
                className="space-y-6"
                onSubmit={aboutHomeSectionForm.handleSubmit((values) =>
                  aboutHomeSectionMutation.mutate(values)
                )}
              >
                <div className="grid gap-6 md:grid-cols-[1fr_400px]">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                          Title and description for the about section on the homepage
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={aboutHomeSectionForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="The Rise of Juanito Bayani" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={aboutHomeSectionForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter description (use double line breaks for paragraphs)"
                                  rows={6}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Use double line breaks to create separate paragraphs
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
                        {aboutHomeImagePreview ? (
                          <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                            <Image
                              src={aboutHomeImagePreview}
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
                                aboutHomeSectionForm.setValue("image", "");
                                setAboutHomeImagePreview("");
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
                                onChange={handleAboutHomeImageUpload}
                                disabled={aboutHomeUploading}
                                className="hidden"
                                id="about-home-image-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={aboutHomeUploading}
                                onClick={() =>
                                  document.getElementById("about-home-image-upload")?.click()
                                }
                              >
                                {aboutHomeUploading ? "Uploading..." : "Choose File"}
                              </Button>
                            </div>
                          </div>
                        )}

                        <FormField
                          control={aboutHomeSectionForm.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/image.jpg"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setAboutHomeImagePreview(e.target.value);
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
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <Button
                    disabled={aboutHomeSectionMutation.isPending}
                    type="submit"
                  >
                    {aboutHomeSectionMutation.isPending
                      ? "Saving..."
                      : "Save About Home Section"}
                  </Button>
                </div>
              </form>
            </Form>

            {/* About Page Form */}
            <Form {...aboutPageForm}>
              <form
                className="space-y-6"
                onSubmit={aboutPageForm.handleSubmit((values) =>
                  aboutPageMutation.mutate(values)
                )}
              >
                <div className="grid gap-6 md:grid-cols-[1fr_400px]">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>
                          Add up to 9 team members with their details and social links
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {teamFields.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <User className="mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="mb-4 text-muted-foreground">
                              No team members added yet
                            </p>
                            <Button
                              onClick={() =>
                                appendTeam({
                                  name: "",
                                  title: "",
                                  imageUrl: "",
                                  socialLinks: {
                                    twitter: "",
                                    facebook: "",
                                    instagram: "",
                                    youtube: "",
                                    linkedin: "",
                                  },
                                })
                              }
                              type="button"
                              variant="outline"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add First Team Member
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {teamFields.map((field, index) => (
                              <Card key={field.id} className="border-2">
                                <CardHeader className="pb-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <CardTitle className="text-lg">
                                        Team Member {index + 1}
                                      </CardTitle>
                                      <CardDescription>
                                        {aboutPageForm.watch(`team.${index}.name`) || "Enter team member details"}
                                      </CardDescription>
                                    </div>
                                    <Button
                                      disabled={teamFields.length <= 1}
                                      onClick={() => removeTeam(index)}
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                                    <div className="space-y-4">
                                      <div>
                                        <label className="mb-2 block text-sm font-medium">Profile Image</label>
                                        {teamMemberImagePreviews[index] ? (
                                          <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                                            <Image
                                              alt={`${aboutPageForm.watch(`team.${index}.name`) || "Team member"} preview`}
                                              className="object-cover"
                                              fill
                                              src={teamMemberImagePreviews[index]}
                                            />
                                            <Button
                                              type="button"
                                              variant="destructive"
                                              size="icon"
                                              className="absolute top-2 right-2"
                                              onClick={() => {
                                                aboutPageForm.setValue(`team.${index}.imageUrl`, "");
                                                setTeamMemberImagePreviews((prev) => {
                                                  const next = { ...prev };
                                                  delete next[index];
                                                  return next;
                                                });
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
                                                onChange={(e) => handleTeamMemberImageUpload(e, index)}
                                                disabled={teamMemberUploading[index]}
                                                className="hidden"
                                                id={`team-member-image-${index}`}
                                              />
                                              <Button
                                                type="button"
                                                variant="outline"
                                                disabled={teamMemberUploading[index]}
                                                onClick={() =>
                                                  document.getElementById(`team-member-image-${index}`)?.click()
                                                }
                                              >
                                                {teamMemberUploading[index] ? "Uploading..." : "Choose File"}
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      <FormField
                                        control={aboutPageForm.control}
                                        name={`team.${index}.imageUrl`}
                                        render={({ field: itemField }) => (
                                          <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="https://example.com/image.jpg"
                                                {...itemField}
                                                onChange={(e) => {
                                                  itemField.onChange(e);
                                                  setTeamMemberImagePreviews((prev) => ({
                                                    ...prev,
                                                    [index]: e.target.value,
                                                  }));
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
                                    </div>

                                    <div className="space-y-4">
                                      <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                          control={aboutPageForm.control}
                                          name={`team.${index}.name`}
                                          render={({ field: itemField }) => (
                                            <FormItem>
                                              <FormLabel>Name</FormLabel>
                                              <FormControl>
                                                <Input placeholder="John Doe" {...itemField} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={aboutPageForm.control}
                                          name={`team.${index}.title`}
                                          render={({ field: itemField }) => (
                                            <FormItem>
                                              <FormLabel>Title</FormLabel>
                                              <FormControl>
                                                <Input placeholder="2D Artist" {...itemField} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>

                                      <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                                        <div className="flex items-center gap-2">
                                          <h4 className="font-semibold text-sm">Social Links</h4>
                                          <span className="text-muted-foreground text-xs">(Optional)</span>
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                          <FormField
                                            control={aboutPageForm.control}
                                            name={`team.${index}.socialLinks.twitter`}
                                            render={({ field: itemField }) => (
                                              <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                  {itemField.value && (
                                                    <Twitter className="h-4 w-4" />
                                                  )}
                                                  Twitter
                                                </FormLabel>
                                                <FormControl>
                                                  <Input placeholder="https://twitter.com/username" {...itemField} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={aboutPageForm.control}
                                            name={`team.${index}.socialLinks.facebook`}
                                            render={({ field: itemField }) => (
                                              <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                  {itemField.value && (
                                                    <Facebook className="h-4 w-4" />
                                                  )}
                                                  Facebook
                                                </FormLabel>
                                                <FormControl>
                                                  <Input placeholder="https://facebook.com/username" {...itemField} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={aboutPageForm.control}
                                            name={`team.${index}.socialLinks.instagram`}
                                            render={({ field: itemField }) => (
                                              <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                  {itemField.value && (
                                                    <Instagram className="h-4 w-4" />
                                                  )}
                                                  Instagram
                                                </FormLabel>
                                                <FormControl>
                                                  <Input placeholder="https://instagram.com/username" {...itemField} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={aboutPageForm.control}
                                            name={`team.${index}.socialLinks.youtube`}
                                            render={({ field: itemField }) => (
                                              <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                  {itemField.value && (
                                                    <Youtube className="h-4 w-4" />
                                                  )}
                                                  YouTube
                                                </FormLabel>
                                                <FormControl>
                                                  <Input placeholder="https://youtube.com/@username" {...itemField} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                          <FormField
                                            control={aboutPageForm.control}
                                            name={`team.${index}.socialLinks.linkedin`}
                                            render={({ field: itemField }) => (
                                              <FormItem className="md:col-span-2">
                                                <FormLabel className="flex items-center gap-2">
                                                  {itemField.value && (
                                                    <Linkedin className="h-4 w-4" />
                                                  )}
                                                  LinkedIn
                                                </FormLabel>
                                                <FormControl>
                                                  <Input placeholder="https://linkedin.com/in/username" {...itemField} />
                                                </FormControl>
                                                <FormMessage />
                                              </FormItem>
                                            )}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}

                            <Button
                              className="w-full"
                              disabled={teamFields.length >= 9}
                              onClick={() =>
                                appendTeam({
                                  name: "",
                                  title: "",
                                  imageUrl: "",
                                  socialLinks: {
                                    twitter: "",
                                    facebook: "",
                                    instagram: "",
                                    youtube: "",
                                    linkedin: "",
                                  },
                                })
                              }
                              type="button"
                              variant="outline"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add Team Member {teamFields.length >= 9 ? "(Max 9 reached)" : `(${teamFields.length}/9)`}
                            </Button>
                          </div>
                        )}
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
                        {aboutPageImagePreview ? (
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                            <Image
                              src={aboutPageImagePreview}
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
                                aboutPageForm.setValue("image", "");
                                setAboutPageImagePreview("");
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
                                Upload an image
                              </p>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleAboutPageImageUpload}
                                disabled={aboutPageUploading}
                                className="hidden"
                                id="about-page-image-upload"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                disabled={aboutPageUploading}
                                onClick={() =>
                                  document.getElementById("about-page-image-upload")?.click()
                                }
                              >
                                {aboutPageUploading ? "Uploading..." : "Choose File"}
                              </Button>
                            </div>
                          </div>
                        )}

                        <FormField
                          control={aboutPageForm.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://example.com/image.jpg"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setAboutPageImagePreview(e.target.value);
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
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <Button disabled={aboutPageMutation.isPending} type="submit">
                    {aboutPageMutation.isPending
                      ? "Saving..."
                      : "Save About Page"}
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

