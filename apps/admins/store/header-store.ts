import { create } from 'zustand';

type BreadcrumbItem = {
  text: string;
  href?: string;
};

interface HeaderStore {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => set({ breadcrumbs })
}));
