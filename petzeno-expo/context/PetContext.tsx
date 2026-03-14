import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type VaccinationRecord = {
  id: string;
  name: string;
  date: string;
  nextDue: string;
  vet: string;
  notes: string;
};

export type MedicalRecord = {
  id: string;
  type: string;
  date: string;
  description: string;
  vet: string;
};

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  gender: "male" | "female";
  color: string;
  allergies: string;
  microchipId: string;
  photo?: string;
  vaccinations: VaccinationRecord[];
  medicalHistory: MedicalRecord[];
  createdAt: string;
};

export type Appointment = {
  id: string;
  petId: string;
  petName: string;
  vetName: string;
  clinicName: string;
  clinicAddress: string;
  date: string;
  time: string;
  type: string;
  status: "upcoming" | "completed" | "cancelled";
  notes: string;
};

export type Notification = {
  id: string;
  type: "vaccination" | "appointment" | "adoption" | "emergency" | "store" | "lost_found" | "community";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
};

type PetContextType = {
  pets: Pet[];
  appointments: Appointment[];
  notifications: Notification[];
  addPet: (pet: Omit<Pet, "id" | "createdAt" | "vaccinations" | "medicalHistory">) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  addVaccination: (petId: string, vaccination: Omit<VaccinationRecord, "id">) => void;
  addMedicalRecord: (petId: string, record: Omit<MedicalRecord, "id">) => void;
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
};

const PetContext = createContext<PetContextType | undefined>(undefined);

const STORAGE_KEYS = {
  pets: "petcare_pets",
  appointments: "petcare_appointments",
  notifications: "petcare_notifications",
};

const DEMO_PETS: Pet[] = [
  {
    id: "pet_001",
    name: "Bruno",
    species: "dog",
    breed: "Labrador Retriever",
    age: 3,
    weight: 28.5,
    gender: "male",
    color: "Golden",
    allergies: "Chicken",
    microchipId: "985141000123456",
    vaccinations: [
      {
        id: "vac_001",
        name: "Rabies",
        date: "2025-06-15",
        nextDue: "2026-06-15",
        vet: "Dr. Sarah Johnson",
        notes: "No adverse reactions",
      },
      {
        id: "vac_002",
        name: "DHPP",
        date: "2025-03-20",
        nextDue: "2026-03-20",
        vet: "Dr. Sarah Johnson",
        notes: "",
      },
      {
        id: "vac_003",
        name: "Bordetella",
        date: "2024-09-10",
        nextDue: "2025-09-10",
        vet: "City Vet Clinic",
        notes: "Annual booster",
      },
    ],
    medicalHistory: [
      {
        id: "med_001",
        type: "Check-up",
        date: "2025-12-01",
        description: "Annual wellness exam. All vitals normal.",
        vet: "Dr. Sarah Johnson",
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "pet_002",
    name: "Whiskers",
    species: "cat",
    breed: "Persian",
    age: 5,
    weight: 4.2,
    gender: "female",
    color: "White",
    allergies: "None",
    microchipId: "985141000654321",
    vaccinations: [
      {
        id: "vac_004",
        name: "FVRCP",
        date: "2025-08-20",
        nextDue: "2026-08-20",
        vet: "City Vet Clinic",
        notes: "",
      },
    ],
    medicalHistory: [],
    createdAt: "2024-02-20T09:00:00Z",
  },
];

const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "apt_001",
    petId: "pet_001",
    petName: "Bruno",
    vetName: "Dr. Sarah Johnson",
    clinicName: "PawCare Veterinary Clinic",
    clinicAddress: "123 Park Avenue, Downtown",
    date: "2026-03-15",
    time: "10:30",
    type: "Annual Check-up",
    status: "upcoming",
    notes: "Bring vaccination records",
  },
  {
    id: "apt_002",
    petId: "pet_002",
    petName: "Whiskers",
    vetName: "Dr. Mike Chen",
    clinicName: "City Animal Hospital",
    clinicAddress: "456 Oak Street",
    date: "2026-03-20",
    time: "14:00",
    type: "Dental Cleaning",
    status: "upcoming",
    notes: "",
  },
];

const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_001",
    type: "vaccination",
    title: "Vaccination Due Soon",
    message: "Bruno's Bordetella vaccination is due in 3 days",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: "notif_002",
    type: "appointment",
    title: "Appointment Reminder",
    message: "Bruno has an appointment tomorrow at 10:30 AM with Dr. Sarah Johnson",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
  {
    id: "notif_003",
    type: "adoption",
    title: "New Pets Available",
    message: "3 new dogs are available for adoption at Sunshine Shelter",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
  {
    id: "notif_004",
    type: "lost_found",
    title: "Nearby Lost Pet Alert",
    message: "A Beagle matching your search was spotted 2km away in City Park",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    read: false,
  },
  {
    id: "notif_005",
    type: "community",
    title: "New Comment on Your Post",
    message: "Dr. Mike commented: 'That's a very healthy diet for a Persian cat!'",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
];

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEYS.pets, JSON.stringify(pets));
    }
  }, [pets, loaded]);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEYS.appointments, JSON.stringify(appointments));
    }
  }, [appointments, loaded]);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
    }
  }, [notifications, loaded]);

  const loadData = async () => {
    try {
      const [petsData, notifsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.pets),
        AsyncStorage.getItem(STORAGE_KEYS.notifications),
      ]);
      setPets(petsData ? JSON.parse(petsData) : DEMO_PETS);
      setNotifications(notifsData ? JSON.parse(notifsData) : DEMO_NOTIFICATIONS);
      
      // Fetch Real-time Appointments from Backend
      fetchAppointments();
    } catch {
      setPets(DEMO_PETS);
      setNotifications(DEMO_NOTIFICATIONS);
    } finally {
      setLoaded(true);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/appointments?userId=dev_user_123`);
      if (response.ok) {
        const data = await response.json();
        // Transform backend _id to id and ensure status consistency
        const transformed = data.map((a: any) => ({
          ...a,
          id: a._id,
        }));
        setAppointments(transformed);
      }
    } catch (err) {
      console.log('Failed to fetch appointments');
      setAppointments(DEMO_APPOINTMENTS);
    }
  };

  // Poll for status updates
  useEffect(() => {
    if (loaded) {
      // Stop polling to reduce backend load as requested by user
      // const interval = setInterval(fetchAppointments, 15000);
      return () => {
        // clearInterval(interval);
      };
    }
  }, [loaded]);

  const addPet = (petData: Omit<Pet, "id" | "createdAt" | "vaccinations" | "medicalHistory">) => {
    const newPet: Pet = {
      ...petData,
      id: generateId("pet"),
      vaccinations: [],
      medicalHistory: [],
      createdAt: new Date().toISOString(),
    };
    setPets((prev) => [...prev, newPet]);
  };

  const updatePet = (id: string, updates: Partial<Pet>) => {
    setPets((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  const addVaccination = (petId: string, vaccination: Omit<VaccinationRecord, "id">) => {
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? {
              ...p,
              vaccinations: [...p.vaccinations, { ...vaccination, id: generateId("vac") }],
            }
          : p
      )
    );
  };

  const addMedicalRecord = (petId: string, record: Omit<MedicalRecord, "id">) => {
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? {
              ...p,
              medicalHistory: [...p.medicalHistory, { ...record, id: generateId("med") }],
            }
          : p
      )
    );
  };

  const addAppointment = async (appointment: Omit<Appointment, "id">) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...appointment, userId: 'dev_user_123' })
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error('Failed to add appointment:', err);
      // Fallback to local
      const newAppt: Appointment = { ...appointment, id: generateId("apt") };
      setAppointments((prev) => [...prev, newAppt]);
    }
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotif: Notification = {
      ...notification,
      id: generateId("notif"),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PetContext.Provider
      value={{
        pets,
        appointments,
        notifications,
        addPet,
        updatePet,
        deletePet,
        addVaccination,
        addMedicalRecord,
        addAppointment,
        updateAppointment,
        addNotification,
        markNotificationRead,
        unreadCount,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (!context) throw new Error("usePets must be used within PetProvider");
  return context;
}
