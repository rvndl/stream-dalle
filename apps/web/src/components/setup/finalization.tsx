import { useRouter } from "next/router";
import { useOverlayUrl } from "../../hooks/use-overlay-url";
import { Label, Input, Button, Card } from "../ui";

export const Finalization = () => {
  const url = useOverlayUrl();
  const router = useRouter();

  return (
    <Card title="Finalization" className="w-full md:w-[30rem]">
      <div className="mt-4 flex gap-4 items-start">
        <section className="grid gap-2 flex-1">
          <div>
            <Label>
              Overlay url
              <span>
                {" "}
                - browser source must be{" "}
                <span className="text-purple-400">1:1 aspect ratio</span>
              </span>
            </Label>
            <Input
              name="overlay_url"
              type="text"
              value={url}
              readOnly
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
        </section>
      </div>
      <Button
        className="self-end mt-4"
        onClick={() => router.push("/dashboard")}
      >
        Finish
      </Button>
    </Card>
  );
};
