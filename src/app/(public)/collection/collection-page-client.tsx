"use client";

import { Card } from "@shadcn/card";
import { CometCard } from "@shadcn/comet-card";
import { Dialog } from "@shadcn/dialog";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CollectionItemDialog } from "@/components/public/collection-item-dialog";

const IMAGE_BORDER_RADIUS = 6;
const IMAGE_PADDING = 3;
const OUTER_BORDER_RADIUS = 10;
const PAD_START_LENGTH = 3;

interface GameAsset {
  id: string;
  title: string;
  image: string;
  category: string;
  difficulty: number;
  type?: string | null;
  description?: string | null;
  blogLink?: string | null;
}

interface CollectionPageClientProps {
  items: GameAsset[];
}

export function CollectionPageClient({ items }: CollectionPageClientProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <section id="drop">
      <div className="container">
        {/* Main Title */}
        <div className="neoh_fn_title">
          <h3 className="fn_title">Our Latest Drops</h3>
          <div className="line">
            <span />
          </div>
        </div>
        {/* !Main Title */}

        {/* Drops List */}
        <div className="neoh_fn_drops">
          <ul>
            {items.map((item, index) => {
              // Use index + 1 for display numbering
              const displayNumber = index + 1;
              
              return (
                <li key={item.id}>
                  <Dialog
                    onOpenChange={(open) =>
                      setSelectedItem(open ? item.id : null)
                    }
                    open={selectedItem === item.id}
                  >
                    <CometCard
                      className="h-full cursor-pointer"
                      onClick={() => setSelectedItem(item.id)}
                    >
                      <div className="item">
                        <div
                          className="img_holder"
                          style={{
                            padding: `${IMAGE_PADDING}px`,
                            borderRadius: `${OUTER_BORDER_RADIUS}px`,
                            overflow: "hidden",
                          }}
                        >
                          <Card className="group h-full overflow-hidden rounded-none border-0 bg-transparent shadow-none">
                            <div
                              className="relative aspect-square overflow-hidden bg-muted"
                              style={{
                                borderRadius: `${IMAGE_BORDER_RADIUS}px`,
                                WebkitBorderRadius: `${IMAGE_BORDER_RADIUS}px`,
                                MozBorderRadius: `${IMAGE_BORDER_RADIUS}px`,
                              }}
                            >
                              <Image
                                alt={item.title}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                fill
                                src={item.image}
                              />
                              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/50" />
                              {/* Name - bottom left */}
                              <div className="absolute bottom-4 left-4 z-10">
                                <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-mono font-semibold text-white text-xs backdrop-blur-md">
                                  {item.title}
                                </div>
                              </div>
                              {/* Comet card ID badge - bottom right */}
                              <div className="absolute right-4 bottom-4 z-10">
                                <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-mono font-semibold text-white text-xs backdrop-blur-md">
                                  #
                                  {String(displayNumber).padStart(
                                    PAD_START_LENGTH,
                                    "0"
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                        <div className="title_holder">
                          <h3 className="fn_title">
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedItem(item.id);
                              }}
                            >
                              {item.title}
                            </Link>
                          </h3>
                        </div>
                      </div>
                    </CometCard>
                    <CollectionItemDialog 
                      item={{
                        id: displayNumber,
                        title: item.title,
                        img: item.image,
                        category: item.category,
                        difficulty: item.difficulty,
                        type: item.type || null,
                        description: item.description || null,
                        blogLink: item.blogLink || null,
                      }} 
                    />
                  </Dialog>
                </li>
              );
            })}
          </ul>
          {/* Clearfix */}
          <div className="clearfix" />
        </div>
        {/* !Drops List */}
      </div>
    </section>
  );
}

