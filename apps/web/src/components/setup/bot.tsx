import { Button } from "../ui";

export const Bot = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-xl w-full md:w-[30rem] flex flex-col">
      <h1 className="font-bold text-2xl">Setup StreamDalle Bot</h1>
      <p className="text-gray-400 leading-tight text-sm">
        Connect StreamDalle Bot to your Twitch channel.
      </p>
      <div className="mt-4 flex flex-rocolw gap-4 items-start">
        <section className="grid gap-2 flex-1">
          <p className="text-gray-400 leading-tight text-sm">
            It is recommended to give the bot the <b>moderator rank</b>, then it
            will be able to automatically return points when redemption is
            invalid
          </p>
          <Button className="mt-2">Connect</Button>
        </section>
      </div>
      <Button className="self-end mt-4">Finish</Button>
    </div>
  );
};
