import { StatusType } from "@/components/atoms/status/type";

export type StatusOptions = {
    value: StatusType;
    label: string;
    color: string;
}

export interface PageHeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  searchQuery?: string | null;
  setSearchQuery?: ((value: string) => void) | null;
  placeholder?: string;
  loading?: boolean;
}

export interface PageHeaderState {
    title?: string;
    showBack?: boolean;
    rightElement?: React.ReactNode;
    statusOptions?: StatusOptions[];
    currentStatus?: StatusType;
}

export interface PageHeaderAction {
    setTitle: (title: string) => void;
    setShowBack: (showBack: boolean) => void;
    setRightElement: (rightElement: React.ReactNode) => void;
    setCurrentStatus: (currentStatus: StatusType) => void;
}

export type PageHeaderStore = PageHeaderState & PageHeaderAction;

