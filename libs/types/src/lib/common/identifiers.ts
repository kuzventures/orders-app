export interface TimeIdentifiers {
    createdAt: string;
    updatedAt: string;
  }
  
  export interface IdIdentifier {
    _id: string;
  }
  
  export type BaseIdentifiers = IdIdentifier & TimeIdentifiers;