export interface SavedItem {
  id: string;
  title: string;
  type: 'study' | 'article' | 'issue';
  subtitle?: string;
  category?: string;
  timestamp: number;
}

const STORAGE_KEY = 'aetherside_saved_items_v1';

export const getSavedItems = (): SavedItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const isItemSaved = (id: string): boolean => {
  const items = getSavedItems();
  return items.some((item) => item.id === id);
};

export const toggleSaveItem = (item: Omit<SavedItem, 'timestamp'>): boolean => {
  const items = getSavedItems();
  const exists = items.some((i) => i.id === item.id);
  let updated: SavedItem[];

  if (exists) {
    updated = items.filter((i) => i.id !== item.id);
  } else {
    updated = [{ ...item, timestamp: Date.now() }, ...items];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('aetherside_saved_updated'));
  } catch {
    // ignore
  }

  return !exists;
};

export const clearSavedItems = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('aetherside_saved_updated'));
  } catch {
    // ignore
  }
};
