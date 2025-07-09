export interface CreateItemDto {
  category: string;
  description: string;
  name: string;
  price: number;
}

export interface UpdateItemDto {
  id: number;
  category: string;
  description: string;
  imgUrl: string;
  name: string;
  price: string;
}

export interface DeleteIdItem {
  id: number;
}
