export  default async function VoteDetailsPage({params}: {params: {id: string}}){
  const {id} = await params;
  return <h1> {id} </h1>

}