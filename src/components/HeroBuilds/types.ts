export type NonProDataType = {
  abilities: [
    {
      id: string;
      img: string;
      key: string;
      level: number;
      type: string;
      slot?: number;
    }
  ];
  hero: string;
  id: number;
  items: [{ id: string; key: string; time: number }];
  match_id: number;
  starting_items: [{ id: string; key: string; time: number }];
  role: string;
  item_neutral?: string;
  win?: number;
  patch: string;
  variant?: number;
  neutral_item_history?: {
    item_neutral: string;
    item_neutral_enhancement: string;
  }[];
};
