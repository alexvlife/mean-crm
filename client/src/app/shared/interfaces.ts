export interface IUser {
  email: string;
  password: string;
}

export interface ICategory {
  name: string;
  imageSrc?: string;
  user?: string;
  _id?: string;
}

export interface IPosition {
  name: string;
  cost: number;
  category: string;
  user?: string;
  _id?: string;
  quantity?: number; // for use on Frontend only
}

export interface IOrder {
  list: IOrderPosition[];
  order?: number;
  date?: Date;
  user?: string;
  _id?: string;
}

export interface IOrderPosition {
  name: string;
  cost: number;
  quantity?: number;
  _id?: string;
}

export interface IResponseMessage {
  message: string;
}
