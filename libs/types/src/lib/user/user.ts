import { GeoLocation } from "../common";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: Address;
  location?: GeoLocation;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
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
  }