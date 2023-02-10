import { Department } from 'src/organization/schema/department.schema';
import { Voucher } from 'src/organization/schema/voucher.schema';
import { EAttachment, EField, EPaymentMethod, ETrigger } from './enumn';

export type AttachmentType = {
  type: EAttachment;
  name: string;
  url: string;
  data: any;
};

export type PaymentType = {
  paymentProof: string;
  originalAmount: number;
  amount: number;
  onlyStandard: boolean;
  paymentMethod: EPaymentMethod;
  voucher: Voucher;
};

export type CommentTextType = {
  text: string;
  colleagueId: string;
};

export type ExtraType = {
  point: number;
  amount: number;
  amountAbsolute: boolean;
};

export type TriggerType = {
  type: ETrigger;
  amount: number;
};

export type PayExtraType = {
  extra: ExtraType;
  reward: boolean;
  trigger: TriggerType;
};

export type LeaveAllowedDepartmentType = {
  department: Department;
  num_allowed: number;
};

export type ReportTypeType = {
  type: EField.CUser | EField.Position | EField.Department;
  value: any;
};

export type LocationType = {
  lat: number;
  lng: number;
};
