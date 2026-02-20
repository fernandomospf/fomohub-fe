import { create } from "zustand";
import { PageHeaderStore, PageHeaderState } from "./type";
import { StatusType } from "@/components/atoms/status/type";

const INITIAL_STATE: PageHeaderState = {
  title: "",
  showBack: false,
  rightElement: null,
  statusOptions: [
    { value: "online",  label: "Online",   color: "bg-green-500" },
    { value: "away",    label: "Ausente",  color: "bg-yellow-500" },
    { value: "offline", label: "Offline",  color: "bg-red-500" },
  ],
  currentStatus: "online",
};


export const usePageHeaderStore = create<PageHeaderStore>((set) => ({
  ...INITIAL_STATE,
  setTitle: (title: string) => set({ title }),
  setShowBack: (showBack: boolean) => set({ showBack }),
  setRightElement: (rightElement: React.ReactNode) => set({ rightElement }),
  setCurrentStatus: (currentStatus: StatusType) => set({ currentStatus }),
}));    