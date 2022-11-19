import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useStepStore } from "../../store/step";
import { trpc } from "../../utils/tprc";
import { PointsIcon } from "../icons";
import { Label, Input, Button, Card } from "../ui";

export const NewReward = () => {
  const [cost, setCost] = useState(10000);
  const [title, setTitle] = useState("");
  const [cooldown, setCooldown] = useState(30);
  const [prompt, setPrompt] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ff0000");
  const nextStep = useStepStore((state) => state.nextStep);

  const { mutate, isLoading } = trpc.auth.createReward.useMutation({
    onSuccess: () => nextStep(),
    onError: (error) => toast.error(error.message),
  });

  const humanCost = new Intl.NumberFormat("en-US").format(cost);

  const handleOnNext = async () => {
    await mutate({
      cost,
      title,
      cooldown,
      backgroundColor,
      prompt,
    });
  };

  return (
    <Card
      title="Create a new Custom Reward"
      description="Create a new custom reward that will be available for your viewers"
      className="w-full md:w-[30rem]"
    >
      <div className="mt-6 flex flex-row gap-4 items-start">
        <section className="grid grid-cols-2 gap-2 flex-1">
          <div>
            <Label>Title</Label>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
            />
          </div>
          <div>
            <Label>Cost</Label>
            <Input
              type="number"
              min={80}
              max={1000000}
              placeholder="Cost"
              value={cost}
              onChange={(e) => setCost(Number(e.currentTarget.value))}
            />
          </div>
          <div>
            <Label>Global cooldown (sec.)</Label>
            <Input
              type="number"
              min={0}
              value={cooldown}
              placeholder="0"
              onChange={(e) => setCooldown(parseInt(e.currentTarget.value))}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              placeholder="Description"
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
            />
          </div>
          <div>
            <Label>Background color</Label>
            <Input
              type="color"
              className="h-[34px] p-1"
              placeholder="0"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.currentTarget.value)}
            />
          </div>
        </section>
        <section>
          <Label>Preview</Label>
          <div
            className="flex items-center justify-center w-24 h-24 rounded-md flex-col"
            style={{
              backgroundColor,
            }}
          >
            <Image src="/reward.png" alt="" width={32} height={32} />
            <p className="bg-black bg-opacity-50 leading-none p-1 text-xs rounded-sm flex gap-0.5">
              <PointsIcon />
              {humanCost}
            </p>
          </div>
        </section>
      </div>
      <Button
        className="self-end mt-4"
        loading={isLoading}
        onClick={handleOnNext}
      >
        Next
      </Button>
    </Card>
  );
};
