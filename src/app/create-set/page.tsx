import { MoveLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";
import { CreateSetForm } from "./_components/create-set-form";

const CreateSetPage = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-start p-4">
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <div className="flex shrink-0 items-start justify-start">
          <Link href="/">
            <Button className="group">
              <MoveLeft className="size-4 duration-200 group-hover:-translate-x-1" />{" "}
              Back
            </Button>
          </Link>
        </div>
        <CreateSetForm />
      </div>
    </main>
  );
};

export default CreateSetPage;
