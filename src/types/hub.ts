export interface WhatWeDoItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
}

export interface MemberContacts {
  instagram?: string;
  facebook?: string;
  line?: string;
  email?: string;
}

export interface Member {
  id: string;
  name: string;
  nickname: string;
  role: string;
  department: string;
  yearAndMajor: string;
  bio: string;
  quote: string;
  imageUrl: string;
  order: number;
  contacts: MemberContacts;
}

export type ServiceStatus = "active" | "coming_soon" | "maintenance";

export interface ServiceWebsite {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  category: string;
  status: ServiceStatus;
  featured: boolean;
  order: number;
}

export interface LineBatch {
  id: string;
  batchNumber: string;
  title: string;
  description: string;
  lineUrl: string;
  lineId: string;
}

export interface SiteConfig {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroTagline: string;
  whoWeAreTitle: string;
  whoWeAreSubtitle: string;
  whoWeAreDescription: string;
  whatWeDoTitle: string;
  whatWeDoSubtitle: string;
  whatWeDoItems: WhatWeDoItem[];
  lineTitle: string;
  lineSubtitle: string;
  lineResponseTime: string;
  lineBatches: LineBatch[];
  igHandle: string;
  igUrl: string;
  igResponseTime: string;
  fbName: string;
  fbUrl: string;
  fbResponseTime: string;
}

export interface HubDatabase {
  siteConfig: SiteConfig;
  members: Member[];
  services: ServiceWebsite[];
  adminPassword: string;
  updatedAt: string;
}

export type PublicHubData = Omit<HubDatabase, "adminPassword">;
