import create from "zustand";

interface StepState {
  step: number;
  nextStep: () => void;
}

export const useStepStore = create<StepState>()((set) => ({
  step: 1,
  nextStep: () => set((state) => ({ step: state.step + 1 })),
}));
