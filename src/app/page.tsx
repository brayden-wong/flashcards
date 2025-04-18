import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import type { Color } from "~/lib/types/color";
import { getSets } from "~/server/data-fetching/get-sets";
import { FolderContextMenu } from "./_components/folder-context-menu";

import { FolderCard } from "./_components/folder";
import { SetCard } from "./_components/set";

const Page = async () => {
  const data = await getSets();

  if (!data) redirect("/");

  console.log(data);

  const { sets, folders } = data;

  return (
    <main className="flex min-h-screen w-full flex-col p-4">
      <header className="flex size-8 w-full items-center justify-end gap-4">
        <Link href="/create-set">
          <Button>Create Set</Button>
        </Link>
        <UserButton appearance={{ elements: { avatarBox: "size-10" } }} />
      </header>
      <FolderContextMenu>
        <DisplayFolders folders={folders} />
        <DisplaySets sets={sets} />
      </FolderContextMenu>
    </main>
  );
};

const DisplayFolders = ({ folders }: DisplayFoldersProps) => {
  if (folders.length < 1) return null;

  return (
    <div>
      <h1 className="text-lg font-medium">Folders</h1>
      <section className="mt-2 grid grid-cols-6 gap-4">
        {folders.map((folder) => (
          <FolderCard key={folder.id} folder={folder} />
        ))}
      </section>
    </div>
  );
};

type DisplaySetsProps = {
  sets: Set[];
};

const DisplaySets = ({ sets }: DisplaySetsProps) => {
  if (sets.length < 1) return null;

  return (
    <div>
      <h1 className="text-lg font-medium">Sets</h1>
      <section className="mt-2 grid grid-cols-6 gap-4">
        {sets.map((set) => (
          <SetCard key={set.id} set={set} />
        ))}
      </section>
    </div>
  );
};

export default Page;

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

type DisplayFoldersProps = {
  folders: Folder[];
};
