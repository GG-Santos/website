import { cn } from "@/lib/utils";

interface FooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Footer({ children, className }: FooterProps) {
  return (
    <footer className={cn("w-full py-12", className)}>
      {children}
    </footer>
  );
}

interface FooterContentProps {
  children: React.ReactNode;
  className?: string;
}

export function FooterContent({ children, className }: FooterContentProps) {
  return (
    <div className={cn(
      "grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5",
      className
    )}>
      {children}
    </div>
  );
}

interface FooterColumnProps {
  children: React.ReactNode;
  className?: string;
}

export function FooterColumn({ children, className }: FooterColumnProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {children}
    </div>
  );
}

interface FooterBottomProps {
  children: React.ReactNode;
  className?: string;
}

export function FooterBottom({ children, className }: FooterBottomProps) {
  return (
    <div className={cn(
      "mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-sm text-muted-foreground md:flex-row",
      className
    )}>
      {children}
    </div>
  );
}






