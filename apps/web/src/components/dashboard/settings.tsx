import { useRouter } from "next/router";
import { useOverlayUrl } from "../../hooks/use-overlay-url";
import { Card, Label, Input, Button } from "../ui";

export const Settings = () => {
  const url = useOverlayUrl();
  const router = useRouter();

  return (
    <Card title="Settings" className="self-start">
      <div className="mt-4 flex flex-col gap-4">
        <div>
          <Label>Overlay url</Label>
          <Input
            value={url}
            readOnly
            onClick={(e) => e.currentTarget.select()}
          />
        </div>
        <Button size="sm" onClick={() => router.push("/setup")}>
          Rerun setup
        </Button>
      </div>
    </Card>
  );
};
