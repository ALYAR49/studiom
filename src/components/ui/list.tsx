import { cn } from "@/lib/utils";
import * as React from "react";

const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
));
List.displayName = "List";

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "block w-full p-3 border-b text-sm transition-colors",
      className
    )}
    {...props}
  />
));
ListItem.displayName = "ListItem";

export { List, ListItem };
