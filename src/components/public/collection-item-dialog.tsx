"use client";

import { Badge } from "@shadcn/badge";
import { Button } from "@shadcn/button";
import { DialogContent, DialogDescription, DialogTitle } from "@shadcn/dialog";
import { ExternalLink, Skull } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CollectionItem {
  id: number;
  title: string;
  img: string;
  description?: string | null;
  category?: string;
  difficulty?: number;
  type?: string | null;
  blogLink?: string | null;
}

interface CollectionItemDialogProps {
  item: CollectionItem;
}

export function CollectionItemDialog({ item }: CollectionItemDialogProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <DialogContent className="!bg-background max-h-[95vh] max-w-6xl gap-0 overflow-hidden rounded-2xl border-border p-0 shadow-2xl sm:max-w-6xl">
      <div className="flex max-h-[95vh] flex-col items-center gap-8 overflow-y-auto p-8 md:flex-row md:gap-6 md:p-12 lg:p-16">
        {/* Image Section - Matching neoh format (50% width) */}
        <div className="relative w-full flex-shrink-0 md:w-1/2">
          <div
            className="group relative aspect-square w-full overflow-hidden rounded-2xl shadow-[0px_0px_50px_rgba(0,0,0,0.6)] md:aspect-auto md:min-h-[500px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              alt={item.title}
              className={`object-cover transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              src={item.img}
            />
            {/* Comet card ID badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-bold font-mono text-sm text-white backdrop-blur-md">
                #{String(item.id).padStart(3, "0")}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Improved format (50% width) */}
        <div className="flex w-full flex-col px-8 md:w-1/2 md:px-10 lg:px-12">
          {/* Pill Tag */}
          <div className="mb-3">
            <Badge
              className="mb-4! rounded-full border-primary/20 bg-primary/10 bg-white! px-4! py-1! font-semibold text-black! text-primary text-xs uppercase tracking-wide"
              variant="secondary"
            >
              {item.category || "NFT Character"}
            </Badge>
          </div>

          {/* Title */}
          <DialogTitle className="mb-1! font-bold text-3xl leading-tight md:text-4xl">
            {item.title}
          </DialogTitle>

          {/* Subtext */}
          <p className="mb-6 text-base text-muted-foreground">
            Juanito Bayani Universe
          </p>

          {/* Description Paragraph */}
          <DialogDescription className="mr-5! mb-8 text-base text-foreground leading-relaxed">
            {item.description ||
              "Discover this unique character from Juanito Bayani. Each asset is carefully crafted to bring the game world to life. This character is part of the Juanito Bayani universe, created by the talented team at Underdogs Studios."}
          </DialogDescription>

          {/* Difficulty and Type Info */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <p className="mb-2! text-muted-foreground text-sm uppercase tracking-wide">
                Difficulty
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skull
                    className={`h-5 w-5 ${
                      i < (item.difficulty || 1)
                        ? "fill-foreground text-foreground"
                        : "fill-muted text-muted opacity-30"
                    }`}
                    key={i}
                  />
                ))}
              </div>
            </div>
            {item.type && (
              <div>
                <p className="mb-2! text-muted-foreground text-sm uppercase tracking-wide">
                  Type
                </p>
                <p className="font-bold text-lg">{item.type}</p>
              </div>
            )}
          </div>

          {/* Single Button */}
          <div className="mt-auto flex justify-start">
            {item.blogLink ? (
              <Button
                asChild
                className="group !bg-black !border-2 !border-white !text-white hover:!border-[#78f701] hover:!text-[#78f701] !transition-all !px-8 !py-3 flex min-w-[150px] items-center gap-3 rounded-md uppercase tracking-wide duration-300"
                size="lg"
                variant="outline"
              >
                <a
                  className="flex items-center gap-3"
                  href={item.blogLink}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="text-center">READ MORE</span>
                  <ExternalLink className="h-4 w-4 transition-colors duration-300 group-hover:text-[#78f701]" />
                </a>
              </Button>
            ) : (
              <Button
                className="!bg-black !border-2 !border-gray-400 !text-gray-400 flex cursor-not-allowed items-center gap-3 rounded-md px-6 py-3 uppercase tracking-wide opacity-50"
                disabled
                size="lg"
                variant="outline"
              >
                <span className="text-center">READ MORE</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}
