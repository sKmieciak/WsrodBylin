export interface UserDto {
  id: number;
  email: string;
  phone: string | null;

  firstName: string;
  lastName: string;
  isCompanyAccount: boolean;

  street: string | null;
  houseNumber: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  addressAddon: string | null;
}


export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;

  isCompanyAccount: boolean;

  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  addressAddon: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
