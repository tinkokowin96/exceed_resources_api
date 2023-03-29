export enum EUser {
  ErApp = 'ErApp',
  Organization = 'Organization',
  OInActive = 'OInActive',
  OAny = 'OAny',
}

export enum EModule {
  Audit = 'Audit',
  Auth = 'Auth',
  Bank = 'Bank',
  Category = 'Category',
  Chat = 'Chat',
  Common = 'Common',
  ErApp = 'ErApp',
  OUser = 'OUser',
  Organization = 'Organization',
  Permission = 'Permission',
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
  ErUserRole = 'ErUserRole',
  OUserRole = 'OUserRole',
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
