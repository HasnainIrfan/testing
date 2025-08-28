export interface UserTypes {
  Address: string
  AddressCity: string
  AddressLatitude: number | null
  AddressLongitude: number | null
  AddressState: string
  AddressZipCode: string
  Birthday: string
  CreatedAt: string
  DeletedAt: string | null
  Email: string
  FirstName: string
  Gender: 'Male' | 'Female' | 'NotToSay'
  Id: string
  JobCategories: string[] | null
  LastActiveDate: string
  LastName: string
  PaymentMethods: string[] | null
  PhoneNumber: string
  ProfileImageId: string | null
  Skills: string[] | null
  Status: 'Verified' | 'Unverified'
  TermsAccepted: boolean
  Type: 'Customer' | 'Admin' | 'Helper'
  UpdatedAt: string
  UserRole: string
  WorkPermitId: string | null
  City: string
  IsVerified: boolean
  State: string
  ZipCode: string
  TotalAmountEarned: number
  Rating: number
  TotalJobsCount: number
  ProfileImage: string
  IsSocialSignup: boolean
  SocialImageUrl: string
}

export interface UserData {
  TokenUuid: string
  User: UserTypes
}

export interface SignInData {
  email: string
  password: string
}

export interface SignUpData {
  TokenUuid: string
  User: SignUpUserType
  Iagree: boolean
  ProfileImageId: number
  ConfirmPassword: string
  Password: string
  City: string
  Address: string
  AddressLatitude: {
    lat: number
    lng: number
  }
  AddressLongitude: {
    lat: number
    lng: number
  }
  Email: string
}

export interface SignUpUserType {
  FirstName: string
  LastName: string
  Email: string
  PhoneNumber: string
  Password: string
  ConfirmPassword: string
  City: string
  ZipCode: string
  Address: string
  State: string
  Iagree: boolean
  ProfileImageId: number
  Status: 'Unverified' | 'Verified'
}

export interface HelperDataType {
  Birthday: string
  Gender: 'Male' | 'Female' | 'NotToSay'
  JobCategories: string[] | null
  Skills: string[] | null
  ProfileImageId: string | null
  older: boolean
  WorkPermitId: string | null
}
