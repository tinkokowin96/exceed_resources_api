export enum EUser {
  ErApp = 'ErApp',
  OAdmin = 'OAdmin',
  Organization = 'Organization',
}

export enum EModule {
  Audit = 'Audit',
  Auth = 'Auth',
  Bank = 'Bank',
  Category = 'Category',
  Chat = 'Chat',
  Common = 'Common',
  ErApp = 'ErApp',
  OAdminApp = 'OAdminApp',
  OUser = 'OUser',
  Organization = 'Organization',
  Permission = 'Permission',
  Project = 'Project',
  Report = 'Report',
  Salary = 'Salary',
}

export enum ETrigger {
  Minute = 'Minute',
  Hour = 'Hour',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
  Amount = 'Amount',
}

export enum ESubscriptionStatus {
  Active = 'Active',
  Guest = 'Guest',
  Expired = 'Expired',
  Suspended = 'Suspended',
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

export enum ECategory {
  Status = 'Status',
  Priority = 'Priority',
  Organization = 'Organization',
  PaymentPlan = 'PaymentPlan',
  Voucher = 'Voucher',
  ErUserRole = 'ErUserRole',
  OUserRole = 'OUserRole',
  Bank = 'Bank',
}

export enum EWorkingHour {
  CheckIn = 'CheckIn',
  CheckOut = 'CheckOut',
  Break = 'Break',
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

// export enum EPermission {
//   AdminHomeView = 'AdminHomeView',
//   CUserHomeView = 'CUserHomeView',
//   ChangeStatus = 'ChangeStatus',
//   CreateStatus = 'CreateStatus',
//   CreateTask = 'CreateTask',
//   PayPointPerTask = 'PayPointPerTask',
//   CreateProject = 'CreateProject',
//   PayPointPerProject = 'PayPointPerProject',
//   CreateProjectPhase = 'CreateProjectPhase',
//   CreateProjectQuotation = 'CreateProjectQuotation',
//   CreateChatGroup = 'CreateChatGroup',
//   AdminSalaryView = 'AdminSalaryView',
//   CUserSalaryView = 'CUserSalaryView',
//   OnboardingPermission = 'OnboardingPermission',
//   ViewStructure = 'ViewStructure',
//   ChangeCUserPermission = 'ChangeCUserPermission',
//   ViewCUserDetail = 'ViewCUserDetail',
//   CreateDepartment = 'CreateDepartment',
//   CreatePosition = 'CreatePosition',
//   CreateEvent = 'CreateEvent',
//   ChangeEventPermission = 'ChangeEventPermission',
//   ViewLeave = 'ViewLeave',
//   RequestLeave = 'RequestLeave',
//   GiveLeave = 'GiveLeave',
//   CreateLeaveForm = 'CreateLeaveForm',
//   ViewOvertime = 'ViewOvertime',
//   RequestOvertime = 'RequestOvertime',
//   AssignOvertime = 'AssignOvertime',
//   CreateOvertimeForm = 'CreateOvertimeForm',
//   ViewLate = 'ViewLate',
//   AllowLate = 'AllowLate',
//   ViewCalender = 'ViewCalender',
//   ViewEarning = 'ViewEarning',
//   CreateEarning = 'CreateEarning',
//   CreateEarningForm = 'CreateEarningForm',
//   ChangeEarningPermission = 'ChangeEarningPermission',
//   ViewDeduction = 'ViewDeduction',
//   CreateDeduction = 'CreateDeduction',
//   CreateDeductionForm = 'CreateDeductionForm',
//   ChangeDeductionPermission = 'ChangeDeductionPermission',
//   ViewPermission = 'ViewPermission',
//   ChangePermission = 'ChangePermission',
//   CreatePayroll = 'CreatePayroll',
//   ChangeCurrency = 'ChangeCurrency',
//   CreateCurrency = 'CreateCurrency',
//   CreateBreak = 'CreateBreak',
// }
