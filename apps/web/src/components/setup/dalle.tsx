import { useState } from "react";
import { useStepStore } from "../../store/step";
import { Label, Input, Button } from "../ui";

export const Dalle = () => {
  const [apiKey, setApiKey] = useState("");
  const increase = useStepStore((state) => state.increase);

  return (
    <div className="bg-gray-800 p-4 rounded-xl w-full md:w-[30rem] flex flex-col">
      <h1 className="font-bold text-2xl">Setup DALL·E API</h1>
      <p className="text-gray-400 leading-tight text-sm">
        Setup the DALL·E API to generate custom images.
      </p>
      <div className="mt-4 flex flex-rocolw gap-4 items-start">
        <section className="grid gap-2 flex-1">
          <div>
            <Label>
              API Key{" "}
              <a
                className="text-purple-400 text-xs text-opacity-80 hover:text-opacity-100"
                href="https://beta.openai.com/account/api-keys"
                target="_blank"
              >
                Get it here
              </a>
            </Label>
            <Input
              name="dalle_api_key"
              type="password"
              placeholder="***"
              value={apiKey}
              onChange={(e) => setApiKey(e.currentTarget.value)}
              required
            />
          </div>
        </section>
      </div>
      <Button className="self-end mt-4" onClick={() => increase()}>
        Next
      </Button>
    </div>
  );
};
