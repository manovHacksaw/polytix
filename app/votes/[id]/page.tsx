import  CampaignInfo from "@/components/CampaignInfo";

export default async function VoteDetailsPage({ params }: { params: { id: string } }) {
  const id = await params.id;
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <CampaignInfo id={id} />
      </div>
    </div>
  );
}