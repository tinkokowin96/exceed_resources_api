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
	Branch = 'Branch',
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
	WorkingHour = 'WorkingHour',
	Leave = 'Leave',
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

export enum ECompensation {
	Percentage = 'Percentage',
	Absolute = 'Absolute',
	BaseSalaryPercentage = 'BaseSalaryPercentage',
	Leave = 'Leave',
}

export enum EEarningTrigger {
	CustomWorkingDay = 'CustomWorkingDay',
}

export enum ETime {
	Minute = 'Minute',
	Hour = 'Hour',
	Day = 'Day',
}

export enum ESubscriptionStatus {
	Pending = 'Pending',
	Approved = 'Approved',
	Refunded = 'Refunded',
	Declined = 'Declined',
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

export enum EExtraSalaryStatus {
	Penalized = 'Penalized',
	Approved = 'Approved',
	Pending = 'Pending',
	Declined = 'Declined',
	Tolerated = 'Tolerated',
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
	Event = 'Event',
	PointTransaction = 'PointTransaction',
	ExtraSalary = 'ExtraSalary',
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
	User = 'User',
	Department = 'Department',
	Position = 'Position',
	Date = 'Date',
	String = 'String',
	Number = 'Number',
}

export enum EWeekDay {
	Sun = 'Sun',
	Mon = 'Mon',
	Tue = 'Tue',
	Wed = 'Wed',
	Thurs = 'Thurs',
	Fri = 'Fri',
	Sat = 'Sat',
}

export enum EMonth {
	Jan = 'Jan',
	Feb = 'Feb',
	Mar = 'Mar',
	Apr = 'Apr',
	May = 'May',
	June = 'June',
	July = 'July',
	Aug = 'Aug',
	Sep = 'Sep',
	Oct = 'Oct',
	Nov = 'Nov',
	Dec = 'Dec',
}

export enum EScheduledTask {
	PaySalary = 'PaySalary',
	Event = 'Event',
}

/**
 * Deduction
 * late, leave
 *
 * Earning
 * Overtime
 * Custom Working Day
 */
