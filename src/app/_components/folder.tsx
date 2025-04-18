"use client";

import { Folder, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { getComputedColorValue } from "~/lib/funcs/generate-color";
import { ChangeColorForm } from "./change-color-form";
import type { Color } from "~/lib/types/color";
import { cn } from "~/lib/utils";

type Set = {
  id: string;
  name: string;
};

type Folder = {
  id: string;
  name: string;
  color: Color;
  sets: Set[];
};

export const FolderCard = ({ folder }: { folder: Folder }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="relative rounded-md border bg-secondary px-4 py-2 shadow">
          <div className="flex items-center justify-between">
            <Folder
              stroke={getComputedColorValue(folder.color)}
              fill={getComputedColorValue(folder.color)}
              className={cn(
                "size-5",
                folder.color === "white" && "stroke-black",
              )}
            />
            <Link href="/#">
              <h2 className="tex-xl font-semibold">{folder.name}</h2>
              <span className="absolute inset-0" />
            </Link>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem className="cursor-pointer gap-2">
            <SquareArrowOutUpRight className="size-4" />
            Rename
          </ContextMenuItem>

          <ContextMenuSub>
            <ContextMenuSubTrigger>Colors</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ChangeColorForm id={folder.id} color={folder.color} />
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};
