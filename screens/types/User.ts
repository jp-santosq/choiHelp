// types/User.ts

export interface User {
  id: string;
  fullName: string;
  age?: number; // オプション（生年月日を使用する場合）
  dateOfBirth: string; // ISO形式 'YYYY-MM-DD'
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  photoUri?: string; // 画像ピッカーからのURI

  // 住所と連絡先
  address?: string;
  room?: string; // 例: Apartment B12
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  gpName?: string; // かかりつけ医
  gpContact?: string;

  // 医療情報
  allergies?: string[]; // 文字列の配列
  medications?: { name: string; dosage: string; schedule: string }[]; // オブジェクトの配列
  diagnoses?: string[];
  mobilityLimitations?: string[]; // 例: ['Walker', 'Fall Risk']
  assistiveDevices?: string[]; // 例: ['Hearing Aid', 'Glasses']

  // 精神状態と行動
  memoryIssues?: boolean;
  moodDescription?: string; // 例: 'Often restless', 'Calm', 'Social'
  sleepPattern?: string; // 例: 'Active at night'

  // 警告または特記事項
  fallRiskWarning?: boolean; // 警告のための具体的なブール値
  tendencyToWander?: boolean; // 徘徊傾向
  restrictedDiet?: string; // 制限された食事
  visionImpairment?: boolean; // 視覚障害
  hearingImpairment?: boolean; // 聴覚障害

  // 日常生活とルーティン
  fixedDailyStructure?: { time: string; activity: string }[];
  hobbies?: string[];
  familyVisitTimes?: string[];

  // 個人の好み
  favoriteFoods?: string[];
  favoriteMusic?: string[];
  preferredLanguage?: string;
  religionCustoms?: string;

  // 追加のメモ
  notesOnRestlessness?: string; // 落ち着かないときに役立つこと
  enjoyedActivities?: string; // 楽しめる活動
  whatMakesThemHappy?: string; // 幸せにすること
}