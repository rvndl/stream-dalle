import { useRouter } from "next/router";
import { Spinner } from "../../components/ui";
import { trpc } from "../../utils/tprc";
import { Tabs } from "../../components/tabs";
import { useMemo, useState } from "react";

const tabKeysText: Record<string, string> = {
  REDEMPTION: "Redemptions",
  RESUB: "Resubs",
  FIRST_MESSAGE: "First messages",
};

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("");
  const router = useRouter();
  const { name } = router.query;

  const { data: gallery } = trpc.gallery.list.useQuery(
    { name: name as string, type: activeTab },
    {
      enabled: !!name || !!activeTab,
      refetchOnWindowFocus: false,
    }
  );

  const { data: stats, isLoading: isStatsLoading } =
    trpc.gallery.stats.useQuery(
      { name: name as string },
      {
        enabled: !!name,
        refetchOnWindowFocus: false,
      }
    );

  const tabs = useMemo(() => {
    if (!stats) {
      return;
    }

    const transformedStats = stats?.reduce(
      (acc, value) => Object.assign(acc, { [value.type]: value._count }),
      {}
    ) as Record<string, number>;

    return Object.keys(transformedStats)
      .sort((a, b) => transformedStats?.[b] - transformedStats?.[a])
      .map((key) => ({
        key,
        text: `${tabKeysText[key]} (${transformedStats?.[key] || 0})`,
      }));
  }, [stats]);

  if (isStatsLoading)
    return (
      <div className="w-full flex items-center justify-center gap-2 mt-10">
        <Spinner className="w-8 h-8 text-purple-400" />
        <p className="font-bold text-xl text-gray-200">Loading...</p>
      </div>
    );

  return (
    <main className="w-full p-8">
      {tabs && (
        <Tabs tabs={tabs} onTabChange={(tab) => setActiveTab(tab.key)} />
      )}
      <section className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 gap-8 rounded-xl mt-8">
        {gallery?.map((art) => (
          <div
            key={art.id}
            className="w-full bg-gray-800 shadow-md rounded-xl hover:-translate-y-2 transition hover:shadow-xl"
          >
            <img
              src={process.env.NEXT_PUBLIC_BACKUP_URL + "/" + art.url}
              className="w-full h-auto rounded-t-xl"
              alt="art"
              loading="lazy"
            />
            <div className="w-full p-4">
              <h2 className="font-semibold truncate w-full text-lg">
                {art.redeemer}
              </h2>
              <p className="text-gray-400 leading-tight mt-1">{art.prompt}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Gallery;
