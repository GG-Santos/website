"use client";

import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TeamMember {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
}

interface TeamProps {
  members?: TeamMember[];
}

const defaultTeamMembers: TeamMember[] = [
  {
    name: "Team Member 1",
    title: "Game Director",
    bio: "Visionary leader with 10+ years in game development",
    imageUrl: "/img/author/1.jpg",
  },
  {
    name: "Team Member 2",
    title: "Lead Developer",
    bio: "Full-stack wizard crafting the game's technical foundation",
    imageUrl: "/img/author/2.jpg",
  },
  {
    name: "Team Member 3",
    title: "Art Director",
    bio: "Bringing visual storytelling to life through stunning artistry",
    imageUrl: "/img/author/3.jpg",
  },
  {
    name: "Team Member 4",
    title: "Game Designer",
    bio: "Designing engaging mechanics and memorable experiences",
    imageUrl: "/img/author/4.jpg",
  },
  {
    name: "Team Member 5",
    title: "Sound Designer",
    bio: "Creating immersive audio landscapes that enhance gameplay",
    imageUrl: "/img/author/1.jpg",
  },
  {
    name: "Team Member 6",
    title: "Producer",
    bio: "Orchestrating projects and ensuring smooth development flow",
    imageUrl: "/img/author/2.jpg",
  },
];

const Team = ({ members = defaultTeamMembers }: TeamProps) => {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            The Team
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            Meet Our Team
          </h2>
          <p className="text-lg leading-8 text-muted-foreground max-w-xl mx-auto">
            Six talented individuals working together to bring{" "}
            <span className="font-semibold text-foreground">Juanito Bayani</span> to life. 
            Our team combines creativity, technical expertise, and an unwavering passion for game development.
          </p>
        </div>

        {/* Team Grid */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div key={member.name} className="flex flex-col">
              {/* Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted mb-6">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              
              {/* Content */}
              <div className="flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  {member.title}
                </p>
                <p className="text-sm leading-6 text-muted-foreground mb-6 flex-1">
                  {member.bio}
                </p>
                
                {/* Social Links */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-muted"
                    asChild
                  >
                    <Link href="#" target="_blank" aria-label={`${member.name} Twitter`}>
                      <Twitter className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-muted"
                    asChild
                  >
                    <Link href="#" target="_blank" aria-label={`${member.name} LinkedIn`}>
                      <Linkedin className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-muted"
                    asChild
                  >
                    <Link href="#" target="_blank" aria-label={`${member.name} Email`}>
                      <Mail className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
