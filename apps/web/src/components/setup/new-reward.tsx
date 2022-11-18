import Image from "next/image";
import { useState } from "react";
import { useStepStore } from "../../store/step";
import { PointsIcon } from "../icons";
import { Label, Input, Button } from "../ui";

export const NewReward = () => {
  const [cost, setCost] = useState(10000);
  const [backgroundColor, setBackgroundColor] = useState("#ff0000");
  const increase = useStepStore((state) => state.increase);

  const humanCost = new Intl.NumberFormat("en-US").format(cost);

  return (
    <div className="bg-gray-800 p-4 rounded-xl w-full md:w-[30rem] flex flex-col">
      <h1 className="font-bold text-2xl">Create a new Custom Reward</h1>
      <p className="text-gray-400 leading-tight text-sm">
        Create a new custom reward that will be available for your viewers.
      </p>
      <div className="mt-6 flex flex-row gap-4 items-start">
        <section className="grid grid-cols-2 gap-2 flex-1">
          <div>
            <Label>Title</Label>
            <Input placeholder="Title" required />
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
            <Label>Global cooldown</Label>
            <Input type="number" min={0} placeholder="0" />
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
      <Button className="self-end mt-4" onClick={() => increase()}>
        Next
      </Button>
    </div>
  );
};
