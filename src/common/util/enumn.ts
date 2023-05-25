export enum EUser {
  ErApp = 'ErApp',
  Organization = 'Organization',
  InActive = 'InActive',
  Any = 'Any',
}

export enum EChatGroup {
  Project = 'Project',
  Channel = 'Channel',
  Group = 'Group',
  Department = 'Department',
}

export enum EMessage {
  Mention = 'Mention',
  Bold = 'Bold',
  Italic = 'Italic',
  StrikeThrough = 'StrikeThrough',
  Link = 'Link',
  Code = 'Code',
}

export enum EModule {
  Audit = 'Audit',
  Auth = 'Auth',
  Bank = 'Bank',
  Category = 'Category',
  Chat = 'Chat',
  Common = 'Common',
  ErApp = 'ErApp',
  User = 'User',
  Organization = 'Organization',
  Permission = 'Permission',
  Department = 'Department',
  Position = 'Position',
  Break = 'Break',
  Project = 'Project',
  Report = 'Report',
  Salary = 'Salary',
  Subscription = 'Subscription',
}

export enum ETrigger {
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
  Count = 'Count',
}

export enum EExtra {
  Percentage = 'Percentage',
  Absolute = 'Absolute',
  BaseSalaryPercentage = 'BaseSalaryPercentage',
}

export enum EServiceTrigger {
  Find = 'Find',
  Create = 'Create',
  Update = 'Update',
}

export enum EExtraAllowance {
  Percentage = 'Percentage',
  Absolute = 'Absolute',
  BaseSalaryPercentage = 'BaseSalaryPercentage',
  Leave = 'Leave',
  Allowance = 'Allowance',
}

export enum ESubscriptionStatus {
  Approved = 'Approved',
  Refunded = 'Refunded',
  Declined = 'Declined',
}

export enum EPaymentMethod {
  AyaMBanking = 'AyaMBanking',
  AyaBank = 'AyaBank',
  AyaPay = 'AyaPay',
  KbzMBanking = 'KbzMBanking',
  KbzBank = 'KbzBank',
  KbzPay = 'KbzPay',
}

export enum ERequestMethod {
  Post = 'Post',
  Put = 'Put',
  Patch = 'Patch',
  Delete = 'Delete',
}

export enum ERequestStatus {
  Approved = 'Approved',
  Pending = 'Pending',
  Declined = 'Declined',
}

export enum ECategory {
  Status = 'Status',
  Priority = 'Priority',
  Organization = 'Organization',
  PaymentPlan = 'PaymentPlan',
  Cupon = 'Cupon',
  UserRole = 'UserRole',
  Bank = 'Bank',
  Leave = 'Leave',
}

export enum EWorkingHour {
  CheckIn = 'CheckIn',
  CheckOut = 'CheckOut',
  Break = 'Break',
}

export enum EPosition {
  Owner = 'Owner',
  CEO = 'CEO',
  DepartmentHead = 'DepartmentHead',
  TeamLeader = 'TeamLeader',
  Member = 'Member',
}

export enum EAttachment {
  Video = 'Video',
  Image = 'Image',
  Pdf = 'Pdf',
  Thumbnail = 'Thumbnail',
  Url = 'Url',
  Others = 'Others',
}

export enum EField {
  CUser = 'CUser',
  Department = 'Department',
  Position = 'Position',
  Report = 'Report',
  Date = 'Date',
  String = 'String',
  Number = 'Number',
}

export enum EFieldCategory {
  Salary = 'Salary',
}

export enum EWeekDay {
  Mon = 'Mon',
  Tue = 'Tue',
  Wed = 'Wed',
  Thurs = 'Thurs',
  Fri = 'Fri',
  Sat = 'Sat',
  Sun = 'Sun',
}

export enum EAddon {
  VideoCall = 'VideoCall',
}
