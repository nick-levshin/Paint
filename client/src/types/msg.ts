export type Msg = {
  id: string;
  method: string;
  username?: string;
  figure?: {
    type: string;
    x: number;
    y: number;
    color: string;
    width?: number;
    height?: number;
    radius?: number;
  };
};
