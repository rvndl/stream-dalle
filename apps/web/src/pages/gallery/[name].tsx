import { useRouter } from "next/router";
import { Spinner } from "../../components/ui";
import { trpc } from "../../utils/tprc";

const Gallery = () => {
  const router = useRouter();
  const { name } = router.query;

  const { data, isLoading } = trpc.gallery.list.useQuery(
    { name: name as string },
    {
      enabled: !!name,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center gap-2 mt-10">
        <Spinner className="w-8 h-8 text-purple-400" />
        <p className="font-bold text-xl text-gray-200">Loading...</p>
      </div>
    );

  if (!data) {
    return null;
  }

  return (
    <main className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 gap-8 p-8 rounded-xl">
      {data.map((art) => (
        <section
          key={art.id}
          className="w-full bg-gray-800 shadow-md rounded-xl hover:-translate-y-2 transition hover:shadow-xl"
        >
          {}
          <img
            src={process.env.NEXT_PUBLIC_BACKUP_URL + "/" + art.url}
            className="w-full h-auto rounded-t-xl"
            alt="art"
          />
          <div className="w-full p-4">
            <h2 className="font-semibold truncate w-full text-lg">
              {art.redeemer}
            </h2>
            <p className="text-gray-400 leading-tight mt-1">{art.prompt}</p>
          </div>
        </section>
      ))}
    </main>
  );
};

export default Gallery;
