// 🧠 פרופיל מלא של משתמש
export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  password?: string; // אופציונלי – לא מחזירים אותו בקליינט
  phoneNumber?: string;
  profileImageUrl?: string;

  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };

  radius: number; // מרחק מועדף להצעות קרובות

  interests?: string[];     // תחומי עניין
  skills?: string[];        // כישורים שניתן להציע
  communityRating?: number; // דירוג קהילתי (כוכבים)

  registrationDate: Date;
  lastActiveDate: Date;

  accountType: 'personal' | 'business'; // סוג חשבון

  notifications?: {
    newListings: boolean;
    nearbyHelp: boolean;
    communityEvents: boolean;
  };
}

// 🔐 פרטי התחברות
export interface UserCredentials {
  email: string;
  password: string;
}

// ✅ סטטוס משתמש
export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface JwtPayloadCustom {
  id: string;
  email: string;
  name: string;
  accountType: 'personal' | 'business';
  profileImageUrl?: string;
  radius: number;
  communityRating?: number;
  iat?: number; // issued at
  exp?: number; // expiration
}

