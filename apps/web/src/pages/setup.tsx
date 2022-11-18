import { Dalle, NewReward } from "../components/setup";
import { Bot } from "../components/setup/bot";
import { Steps } from "../components/ui";
import { useStepStore } from "../store/step";
import { match } from "ts-pattern";

const Setup = () => {
  const step = useStepStore((state) => state.step);

  return (
    <main className="h-screen flex flex-col items-center p-12 gap-12">
      <Steps total={3} current={step} />
      {match(step)
        .with(1, () => <NewReward />)
        .with(2, () => <Dalle />)
        .with(3, () => <Bot />)
        .otherwise(() => null)}
    </main>
  );
};

export default Setup;
