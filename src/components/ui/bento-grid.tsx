import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-fr grid-cols-1 gap-4 md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  className,
  name,
  description,
  header,
  icon,
  children,
}: {
  className?: string;
  name?: string;
  description?: string;
  header?: React.ReactNode;
  icon?: React.ElementType;
  children?: React.ReactNode;
}) {
  const Icon = icon;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {header}
      <div className="relative z-10">
        {Icon && (
          <Icon className="mb-4 h-8 w-8 text-foreground/50 transition-colors group-hover:text-foreground" />
        )}
        {name && (
          <div className="mb-2 font-semibold text-lg text-foreground">
            {name}
          </div>
        )}
        {description && (
          <div className="text-sm font-normal leading-relaxed text-muted-foreground">
            {description}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
