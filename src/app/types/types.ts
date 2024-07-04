export interface ProfileData {
  label: string;
  questions: Question[];
}

export interface Question {
  question: string;
  answers: string;
}
