"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListButton } from "@/components/tiptap-ui/list-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import { LinkPopover } from "@/components/tiptap-ui/link-popover";
import { ColorHighlightButton } from "@/components/tiptap-ui/color-highlight-button";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";
import { Toolbar } from "@/components/tiptap-ui-primitive/toolbar";
import { Separator } from "@/components/tiptap-ui-primitive/separator";
import { useCallback } from "react";
import { toast } from "sonner";
import type { UploadFunction } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function BlogEditor({ content, onChange }: BlogEditorProps) {
  const handleImageUpload: UploadFunction = useCallback(async (
    file: File,
    onProgress?: (event: { progress: number }) => void,
    abortSignal?: AbortSignal
  ): Promise<string> => {
    try {
      // Simulate progress for better UX
      onProgress?.({ progress: 10 });

      const formData = new FormData();
      formData.append("file", file);

      onProgress?.({ progress: 30 });

      const controller = new AbortController();
      if (abortSignal) {
        abortSignal.addEventListener("abort", () => controller.abort());
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      onProgress?.({ progress: 70 });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();

      onProgress?.({ progress: 100 });

      return url;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }
      toast.error("Failed to upload image");
      throw error instanceof Error ? error : new Error("Upload failed");
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image,
      ImageUploadNode.configure({
        upload: handleImageUpload,
        maxSize: 5 * 1024 * 1024, // 5MB
        limit: 1,
        accept: "image/*",
        type: "image",
        onError: (error) => {
          toast.error(error.message || "Failed to upload image");
        },
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Toolbar className="border-b p-2 bg-muted/50">
        <UndoRedoButton editor={editor} action="undo" />
        <UndoRedoButton editor={editor} action="redo" />
        <Separator />
        <HeadingDropdownMenu editor={editor} />
        <Separator />
        <MarkButton editor={editor} type="bold" />
        <MarkButton editor={editor} type="italic" />
        <MarkButton editor={editor} type="underline" />
        <MarkButton editor={editor} type="strike" />
        <Separator />
        <ColorHighlightButton editor={editor} />
        <ColorHighlightPopover editor={editor} />
        <Separator />
        <ListButton editor={editor} type="bulletList" />
        <ListButton editor={editor} type="orderedList" />
        <ListDropdownMenu editor={editor} />
        <Separator />
        <BlockquoteButton editor={editor} />
        <CodeBlockButton editor={editor} />
        <Separator />
        <TextAlignButton editor={editor} align="left" />
        <TextAlignButton editor={editor} align="center" />
        <TextAlignButton editor={editor} align="right" />
        <TextAlignButton editor={editor} align="justify" />
        <Separator />
        <ImageUploadButton editor={editor} />
        <LinkPopover editor={editor} />
      </Toolbar>
      <EditorContent editor={editor} />
    </div>
  );
}
