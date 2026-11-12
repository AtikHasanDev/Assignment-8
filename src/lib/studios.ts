export const studioCategories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
] as const;

export type StudioCategory = (typeof studioCategories)[number];

export type StudioInput = {
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  image: string;
  gallery?: string[];
  amenities: string[];
  description: string;
};

export type Studio = Omit<StudioInput, "gallery"> & {
  _id: string;
  gallery: string[];
  ownerName: string;
  rating: number;
  createdAt: string;
  updatedAt?: string;
};

export type OwnedStudio = Studio & {
  ownerId: string;
  ownerEmail: string;
};

export type BookingInput = {
  studioId: string;
  startsAt: string;
  endsAt: string;
};

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type Booking = BookingInput & {
  _id: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  hourlyRate: number;
  securityDeposit: number;
  status: BookingStatus;
  createdAt: string;
  cancelledAt?: string;
};
