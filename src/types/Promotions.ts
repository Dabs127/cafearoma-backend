export interface CreatePromotionDto {
  endDate: Date;
  imgUrl: string;
  longDescription: string;
  shortDescription: string;
  startDate: Date;
  authenticationRequired: boolean;
  title: string;
}
