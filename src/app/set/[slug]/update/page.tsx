import { MoveLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import { getSetToUpdate } from "~/server/data-fetching/get-set-to-update";
import { UpdateSetForm } from "./_components/update-set-form";

type Props = {
  params: Promise<{ slug: string }>;
};

const UpdateSetPage = async ({ params }: Props) => {
  const { slug } = await params;

  const set = await getSetToUpdate(slug);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start p-4">
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <div className="flex shrink-0 items-start justify-start">
          <Link href="/">
            <Button className="group">
              <MoveLeft className="size-4 duration-200 group-hover:-translate-x-1" />
              Back
            </Button>
          </Link>
        </div>
        <UpdateSetForm set={set} />
      </div>
    </main>
  );
};

export default UpdateSetPage;
