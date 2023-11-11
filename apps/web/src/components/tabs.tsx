import { useEffect, useState } from "react";
import { Button } from "./ui";

interface Tab {
  key: string;
  text: string;
}

interface Props {
  tabs: Tab[];
  onTabChange: (activeTab: Tab) => void;
}

export const Tabs = ({ tabs, onTabChange }: Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  useEffect(() => {
    handleOnTabChange(tabs[0]);
  }, []);

  const handleOnTabChange = (tab: Tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <Button
          variant={activeTab === tab ? "primary" : "secondary"}
          key={tab.key}
          onClick={() => handleOnTabChange(tab)}
        >
          {tab.text}
        </Button>
      ))}
    </div>
  );
};
