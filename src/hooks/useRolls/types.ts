export interface RollReq {
  teammateId: number | null;
  date: string;
  session?: number;
  nogi: boolean;
  subsAgainst?: number[];
  subsFor?: number[];
}
export interface FormattedReq {
  teammate_id: number | null;
  date: string;
  nogi: boolean;
  session?: number;
}

export interface SubRes {
  id: number;
  sub: number;
  Subs: {
    name: string;
  };
  roll: number;
}
export interface RollRes {
  id: number;
  created_at: string;
  date: string;
  session?: number;
  nogi: boolean;
  Teammates?: {
    id: number;
    name: string;
    belt: number;
  };
  Subs_against: SubRes[];
  Subs_for: SubRes[];
}

interface Sub {
  id: number;
  roll: number;
  sub: number;
  name: string;
}

export interface Roll {
  id: number;
  created: string;
  date: string;
  session?: number | undefined;
  nogi: boolean;
  teammate?:
    | {
        belt: number;
        name: string;
        id: number;
        beltName: string;
      }
    | undefined;
  subsAgainst: Sub[];
  subsFor: Sub[];
}
