import { GeoLocation, BaseIdentifiers } from "../common";

export interface User extends BaseIdentifiers {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: Address;
  role: UserRole;
  }

  export enum UserRole {
    CUSTOMER = 'Customer',
    ADMIN = 'Admin',
    STAFF = 'Staff'
  }

  export interface Address {
    street: string;
    city: string;
    zipCode: string;
    country: string;
    geoLocation: GeoLocation;
  }