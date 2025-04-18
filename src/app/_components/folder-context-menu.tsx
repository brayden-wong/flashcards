"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus, LinkIcon, StickyNote } from "lucide-react";
import Link from "next/link";
import { useState, type PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { SubmitButton } from "~/components/ui/submit-button";

export const FolderContextMenu = ({ children }: PropsWithChildren) => {
  const [newFolder, setNewFolder] = useState(false);

  if (newFolder) return <NewFolderDialog onClose={() => setNewFolder(false)} />;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem
              className="cursor-pointer gap-2"
              onClick={() => setNewFolder(true)}
            >
              <FolderPlus className="size-4" />
              New Folder
            </ContextMenuItem>
            <ContextMenuItem className="relative gap-2">
              <StickyNote className="size-4" />
              <Link href="/create-set">
                New Set
                <span className="absolute inset-0" />
              </Link>
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

const NewFolderSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

const NewFolderDialog = ({ onClose }: { onClose: () => void }) => {
  const form = useForm<z.infer<typeof NewFolderSchema>>({
    defaultValues: { name: "Untitled Folder" },
    resolver: zodResolver(NewFolderSchema),
  });

  return (
    <Dialog defaultOpen onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-2">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="flex gap-2 sm:flex-row-reverse sm:justify-start">
              <SubmitButton>Create Folder</SubmitButton>
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
