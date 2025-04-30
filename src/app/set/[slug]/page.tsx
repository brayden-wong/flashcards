import { notFound } from "next/navigation";
import {
  FlashcardViewer,
  UtilityBarProvider,
} from "~/app/_components/flashcard";
import { getSet } from "~/server/data-fetching/get-set";

type Props = {
  params: Promise<{ slug: string }>;
};

const SetModalPage = async ({ params }: Props) => {
  const { slug } = await params;

  const set = await getSet(slug);

  if (!set) return notFound();

  return (
    <UtilityBarProvider>
      <FlashcardViewer set={set} />
    </UtilityBarProvider>
  );
};

export default SetModalPage;
