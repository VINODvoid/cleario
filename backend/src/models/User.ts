export interface User {
  id: string;
  name: string;
  password: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  riskTolerance: "low" | "medium" | "high";
  investmentGoals: string[];
  totalInvested: number;
  currentValue: number;
}

