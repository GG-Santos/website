"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect, useRef, useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@shadcn/alert-dialog";
import { SiteHeader } from "@/components/layouts/app/site-header";
import { User, Mail, Calendar, Upload, X, Trash2, Cookie } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  image: z.string().url().optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const MAX_IMAGE_SIZE_MB = 5;
const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * KB_PER_MB * BYTES_PER_KB;

export default function AccountPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const utils = trpc.useUtils();
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [profileUploading, setProfileUploading] = useState(false);
  const profileFileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch user profile
  const { data: profile, isLoading: isLoadingProfile } = trpc.user.getProfile.useQuery(
    undefined,
    {
      enabled: !!session?.user,
    }
  );

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      image: "",
    },
  });

  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      utils.user.getProfile.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const deleteAccountMutation = trpc.user.deleteAccount.useMutation({
    onSuccess: async () => {
      toast.success("Account deleted successfully");
      await signOut();
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
    },
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name || "",
        bio: profile.bio || "",
        image: profile.image || "",
      });
      setProfilePreview(profile.image || "");
    }
  }, [profile, profileForm]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  const handleProfileImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error(`Image size must be under ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    setProfileUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "profile");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      profileForm.setValue("image", data.url, {
        shouldValidate: true,
      });
      setProfilePreview(data.url);
      toast.success("Profile picture uploaded");
    } catch {
      toast.error("Failed to upload profile picture");
    } finally {
      setProfileUploading(false);
      if (profileFileInputRef.current) {
        profileFileInputRef.current.value = "";
      }
    }
  };

  const clearProfileImage = () => {
    profileForm.setValue("image", "", {
      shouldValidate: true,
    });
    setProfilePreview("");
    if (profileFileInputRef.current) {
      profileFileInputRef.current.value = "";
    }
  };

  const onProfileSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate({
      name: values.name,
      bio: values.bio || undefined,
      image: values.image || undefined,
    });
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  if (isPending || !session?.user || isLoadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const { user } = session;

  return (
    <>
      <SiteHeader title="Account" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Account Settings</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_400px]">
              <div className="space-y-6">
                <Form {...profileForm}>
                  <form
                    className="space-y-6"
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your profile details and bio
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about yourself..."
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This bio will appear on your blog posts. Max 500 characters.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          disabled={updateProfileMutation.isPending}
                          type="submit"
                        >
                          {updateProfileMutation.isPending
                            ? "Saving..."
                            : "Save Profile"}
                        </Button>
                      </CardContent>
                    </Card>
                  </form>
                </Form>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                      Upload or update your profile picture
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Form {...profileForm}>
                      <FormField
                        control={profileForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            {profilePreview ? (
                              <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                                <Image
                                  alt="Profile preview"
                                  className="object-cover"
                                  fill
                                  src={profilePreview}
                                />
                                <Button
                                  className="absolute top-2 right-2"
                                  onClick={clearProfileImage}
                                  size="icon"
                                  type="button"
                                  variant="destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed">
                                <div className="text-center">
                                  <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                  <p className="mb-2 text-muted-foreground text-sm">
                                    Upload a profile picture
                                  </p>
                                  <input
                                    accept="image/*"
                                    className="hidden"
                                    disabled={profileUploading}
                                    id="profile-image-upload"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0];
                                      if (file) {
                                        handleProfileImageUpload(file);
                                      }
                                    }}
                                    ref={profileFileInputRef}
                                    type="file"
                                  />
                                  <Button
                                    disabled={profileUploading}
                                    onClick={() =>
                                      profileFileInputRef.current?.click()
                                    }
                                    type="button"
                                    variant="outline"
                                  >
                                    {profileUploading
                                      ? "Uploading..."
                                      : "Choose File"}
                                  </Button>
                                </div>
                              </div>
                            )}
                            <FormControl>
                              <Input
                                className="mt-4"
                                placeholder="Or paste an image URL directly"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  setProfilePreview(e.target.value);
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
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription>
                      Your account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">Email:</span>
                      </div>
                      <p className="ml-6 text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">User ID:</span>
                      </div>
                      <p className="ml-6 text-muted-foreground text-sm font-mono">
                        {user.id}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cookie className="h-5 w-5" />
                      Cookie Preferences
                    </CardTitle>
                    <CardDescription>
                      Manage your cookie and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      You can update your cookie preferences at any time. This allows you to control which cookies and tracking technologies are used on this website.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        // Open the consent dialog by finding and clicking the dialog trigger
                        const dialogTrigger = document.querySelector('[data-c15t-dialog-trigger]') as HTMLElement;
                        if (dialogTrigger) {
                          dialogTrigger.click();
                        } else {
                          toast.info("Please use the cookie banner to manage your preferences");
                        }
                      }}
                      className="w-full"
                    >
                      Manage Cookie Preferences
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={deleteAccountMutation.isPending}
                        variant="destructive"
                      >
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and all associated data including blog posts, roadmap items,
                          and all other content you have created.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deleteAccountMutation.isPending
                            ? "Deleting..."
                            : "Yes, delete my account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
