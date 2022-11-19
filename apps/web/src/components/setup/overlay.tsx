import { useId, useState } from "react";
import toast from "react-hot-toast";
import { useStepStore } from "../../store/step";
import { trpc } from "../../utils/tprc";
import { Art } from "../art";
import { Button, Card, Checkbox, Input, Label } from "../ui";

export const Overlay = () => {
  const [settings, setSettings] = useState({
    showAuthor: true,
    showFrame: true,
    showPrompt: true,
    showTime: 10000,
  });
  const nextStep = useStepStore((state) => state.nextStep);
  const { mutate, isLoading } = trpc.auth.updateSettings.useMutation({
    onSuccess: () => nextStep(),
    onError: (error) => toast.error(error.message),
  });
  const id = useId();

  const handleOnSave = () => mutate(settings);

  return (
    <Card
      title="Customize overlay"
      description="Customize the overlay to your liking."
      className="w-full md:w-[30rem]"
    >
      <div className="mt-4 flex flex-col gap-4 items-start">
        <section className="grid gap-2 flex-1">
          <div className="flex gap-2 items-center">
            <Checkbox
              id={"show-author" + id}
              checked={settings.showAuthor}
              onChange={() =>
                setSettings({
                  ...settings,
                  showAuthor: !settings.showAuthor,
                })
              }
            />
            <Label htmlFor={"show-author" + id} className="mb-0">
              Show author
            </Label>
          </div>
          <div className="flex gap-2 items-center">
            <Checkbox
              id={"show-prompt" + id}
              checked={settings.showPrompt}
              onChange={() =>
                setSettings({
                  ...settings,
                  showPrompt: !settings.showPrompt,
                })
              }
            />
            <Label htmlFor={"show-prompt" + id} className="mb-0">
              Show prompt
            </Label>
          </div>
          <div className="flex gap-2 items-center">
            <Checkbox
              id={"show-frame" + id}
              checked={settings.showFrame}
              onChange={() =>
                setSettings({
                  ...settings,
                  showFrame: !settings.showFrame,
                })
              }
            />
            <Label htmlFor={"show-frame" + id} className="mb-0">
              Show frame
            </Label>
          </div>
          <div className="">
            <Label htmlFor={"show-time" + id}>
              Display time (milliseconds)
            </Label>
            <Input
              id={"show-time" + id}
              type="number"
              min={1000}
              value={settings.showTime}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  showTime: parseInt(e.currentTarget.value),
                })
              }
            />
          </div>
        </section>
        <section className="inline-flex self-center flex-col">
          <Label>Preview</Label>
          <div className="w-96 h-96 relative">
            <Art
              url="https://openai-labs-public-images-prod.azureedge.net/user-i2c8vL0GtUeYM3kox6WPT9EZ/generations/generation-9sZ0qJjfcBSAyl7uwUQ5S03h/image.webp"
              author="JozefBrzeczyszczykiewicz"
              prompt="elaborate drop cap art of the capital letter D integrated in a
      seamless doodle art, organic, decorative, black and white, in the
      style of salvador dali"
              showAuthor={settings.showAuthor}
              showFrame={settings.showFrame}
              showPrompt={settings.showPrompt}
              preview
            />
          </div>
        </section>
      </div>
      <Button
        className="mt-4 self-end"
        loading={isLoading}
        onClick={handleOnSave}
      >
        Next
      </Button>
    </Card>
  );
};
