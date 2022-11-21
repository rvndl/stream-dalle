import { useState } from "react";
import toast from "react-hot-toast";
import { useStepStore } from "../../store/step";
import { trpc } from "../../utils/tprc";
import { Label, Input, Button, Card } from "../ui";

export const Dalle = () => {
  const [apiKey, setApiKey] = useState("");
  const nextStep = useStepStore((state) => state.nextStep);

  const { mutate, isLoading } = trpc.auth.updateApiKey.useMutation({
    onSuccess: () => nextStep(),
    onError: (error) => toast.error(error.message),
  });

  const handleOnNext = () => {
    if (apiKey.length < 48) {
      return;
    }

    mutate({ apiKey });
  };

  return (
    <Card
      title="Setup DALL·E API"
      description=" Setup the DALL·E API to generate custom images."
      className="w-full md:w-[30rem]"
    >
      <div className="mt-4 flex flex-rocolw gap-4 items-start">
        <section className="grid gap-2 flex-1">
          <div>
            <Label className="flex gap-1">
              <p>API Key</p>
              <a
                className="text-purple-400 text-xs text-opacity-80 hover:text-opacity-100 underline"
                href="https://beta.openai.com/account/api-keys"
                target="_blank"
              >
                Get it here
              </a>
              <p> - make sure you have billing set up</p>
            </Label>
            <Input
              id="dalle_api_key"
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
      <Button
        className="self-end mt-4"
        loading={isLoading}
        onClick={() => handleOnNext()}
      >
        Next
      </Button>
    </Card>
  );
};
