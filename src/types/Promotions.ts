export interface CreatePromotionDto {
  endDate: Date;
  imgUrl: string;
  longDescription: string;
  shortDescription: string;
  startDate: Date;
  authenticationRequired: boolean;
  title: string;
}

export interface UpdatePromotionDto {
  id: string;
  endDate: Date;
  imgUrl: string;
  longDescription: string;
  shortDescription: string;
  startDate: Date;
  authenticationRequired: boolean;
  title: string;
}

export interface DeleteIdPromotion {
  id: number;
}
