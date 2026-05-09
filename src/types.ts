export interface Contact {
  email: string;
  phone: string;
  linkedin: string;
  website?: string;
  location?: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  location: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface ResumeData {
  name: string;
  profession: string;
  contact: Contact;
  summary: string;
  experience: Experience[];
  skills: string[];
  education: Education[];
}
