type Props = {
  params: Promise<{ slug: string }>;
};

const SetPage = async ({ params }: Props) => {
  const { slug } = await params;

  return <div>{slug}</div>;
};

export default SetPage;
