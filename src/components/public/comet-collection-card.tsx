"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import { Badge } from "@shadcn/badge";
import { Button } from "@shadcn/button";
import { Card, CardContent, CardHeader } from "@shadcn/card";
import { ArrowRight, ExternalLink } from "lucide-react";

interface CollectionItem {
  id: number;
  title: string;
  img: string;
  description?: string;
  category?: string;
  references?: string[];
}

interface CometCollectionCardProps {
  item: CollectionItem;
}

export function CometCollectionCard({
  item,
}: CometCollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const references = item.references || [
    "Character Design Document",
    "Concept Art Collection",
    "3D Model Repository",
    "Animation Reference Sheet",
  ];

  return (
    <DialogContent className="max-w-7xl max-h-[95vh] p-0 gap-0 sm:max-w-7xl overflow-hidden">
      <div className="grid md:grid-cols-[40%_60%] gap-0 h-full">
        {/* Image Section - Comet Card Style */}
        <div 
          className="relative w-full h-full min-h-[400px] md:min-h-[700px] bg-gradient-to-br from-muted via-muted/80 to-muted/60 overflow-hidden group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:from-black/20" />
          <Image
            src={item.img}
            alt={item.title}
            fill
            className={`object-cover transition-all duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
          {/* Comet effect overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/20 transition-opacity duration-700 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`} />
        </div>

        {/* Content Section - Wider with more details */}
        <div className="p-8 md:p-10 lg:p-12 flex flex-col bg-background overflow-y-auto max-h-[95vh]">
          <DialogHeader className="mb-8 space-y-4">
            <div>
              {item.category && (
                <Badge variant="secondary" className="mb-4 text-xs font-semibold">
                  {item.category}
                </Badge>
              )}
              <DialogTitle className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">
                {item.title}
              </DialogTitle>
            </div>
            <DialogDescription className="text-lg leading-relaxed text-foreground/80 max-w-2xl">
              {item.description ||
                "Discover this unique character from Juanito Bayani. Each asset is carefully crafted to bring the game world to life."}
            </DialogDescription>
          </DialogHeader>

          {/* Character Details Section */}
          <div className="space-y-8 flex-1">
            <div>
              <h3 className="font-semibold text-xl mb-5 flex items-center gap-3">
                <div className="h-1.5 w-16 bg-primary rounded-full" />
                Character Details
              </h3>
              <div className="space-y-4 text-foreground/90 max-w-2xl">
                <p className="leading-relaxed text-base">
                  This character is part of the <strong className="text-foreground font-bold">Juanito Bayani</strong> universe, created
                  by the talented team at <strong className="text-foreground font-bold">Underdogs Studios</strong>.
                </p>
                <p className="leading-relaxed text-base">
                  Every detail has been thoughtfully designed to enhance your
                  gaming experience and immerse you in our world.
                </p>
              </div>
            </div>

            {/* References Section */}
            <div className="pt-4">
              <h3 className="font-semibold text-xl mb-5 flex items-center gap-3">
                <div className="h-1.5 w-16 bg-primary rounded-full" />
                References
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                {references.map((ref, index) => (
                  <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{ref}</span>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t max-w-md">
              <Card className="p-5 bg-muted/50 border-border">
                <div className="text-4xl font-bold mb-2 text-foreground">100%</div>
                <div className="text-sm text-muted-foreground font-medium">Original Design</div>
              </Card>
              <Card className="p-5 bg-muted/50 border-border">
                <div className="text-4xl font-bold mb-2 text-foreground">6</div>
                <div className="text-sm text-muted-foreground font-medium">Team Members</div>
              </Card>
            </div>

            {/* Learn More Button */}
            <div className="pt-6 border-t">
              <Button 
                size="lg" 
                className="w-full md:w-auto px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Game Info Footer */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground font-semibold">Juanito Bayani</strong> by{" "}
                <strong className="text-foreground font-semibold">Underdogs Studios</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

