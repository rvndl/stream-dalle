import {
  Bot,
  Dalle,
  Finalization,
  NewReward,
  Overlay,
} from "../components/setup";
import { Steps } from "../components/ui";
import { useStepStore } from "../store/step";
import { match } from "ts-pattern";

const Setup = () => {
  const step = useStepStore((state) => state.step);

  return (
    <main className="h-screen flex flex-col items-center p-12 gap-12">
      <Steps total={5} current={step} />
      {match(step)
        .with(1, () => <NewReward />)
        .with(2, () => <Dalle />)
        .with(3, () => <Bot />)
        .with(4, () => <Overlay />)
        .with(5, () => <Finalization />)
        .otherwise(() => null)}
    </main>
  );
};

export default Setup;
