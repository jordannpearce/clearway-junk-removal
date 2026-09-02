export type UserRole = "customer" | "ops" | "tech";

export type JobStatus =
  | "requested"
  | "confirmed"
  | "dispatched"
  | "en_route"
  | "on_site"
  | "completed"
  | "cancelled";

export type JobSize = "truck-quarter" | "truck-half" | "truck-three-quarter" | "truck-full";

export type NotifyChannel = "email" | "sms";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  city?: string;
  zip?: string;
};

export type Technician = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  homeCity: string;
  county: "Alameda" | "Contra Costa";
  lat: number;
  lng: number;
  active: boolean;
  specialties: string[];
};

export type Job = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceSlug: string;
  serviceName: string;
  city: string;
  address: string;
  zip: string;
  notes: string;
  size: JobSize;
  scheduledDate: string;
  scheduledWindow: string;
  status: JobStatus;
  technicianId?: string;
  technicianName?: string;
  createdAt: string;
  updatedAt: string;
  reviewRequestedAt?: string;
};

export type NotificationLog = {
  id: string;
  jobId?: string;
  channel: NotifyChannel;
  to: string;
  subject: string;
  body: string;
  provider: string;
  status: "sent" | "mocked" | "failed";
  createdAt: string;
};

export type Session = {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
};

export type SavedLocation = {
  city: string;
  zip: string;
  label: string;
};
