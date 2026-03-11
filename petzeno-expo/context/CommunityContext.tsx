import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Comment = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
};

export type Post = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  petName: string;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  timestamp: string;
};

export type AdoptionPet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: "male" | "female";
  description: string;
  shelterName: string;
  shelterContact: string;
  location: string;
  status: "available" | "adopted" | "pending";
  image: string;
  vaccinated: boolean;
  neutered: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
  adoptionFee: number;
};

export type LostFoundPet = {
  id: string;
  type: "lost" | "found";
  petName: string;
  species: string;
  breed: string;
  description: string;
  location: string;
  date: string;
  contactName: string;
  contactPhone: string;
  reward?: number;
  status: "active" | "resolved";
  image: string;
  userId: string;
};

type CommunityContextType = {
  posts: Post[];
  adoptionPets: AdoptionPet[];
  lostFoundPets: LostFoundPet[];
  addPost: (post: Omit<Post, "id" | "timestamp" | "likes" | "comments">) => void;
  toggleLike: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, "id" | "timestamp">) => void;
  addLostFound: (pet: Omit<LostFoundPet, "id">) => void;
  updateLostFoundStatus: (id: string, status: "active" | "resolved") => void;
};

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

const DEMO_POSTS: Post[] = [
  {
    id: "post_001",
    userId: "user_001",
    userName: "Priya Sharma",
    userAvatar: "🐾",
    petName: "Bruno",
    content: "Bruno just completed his first agility course! So proud of this boy 🎉",
    likes: ["user_002", "user_003"],
    comments: [
      {
        id: "cmt_001",
        userId: "user_002",
        userName: "Rahul K",
        userAvatar: "🐕",
        text: "Amazing! Bruno is such a good boy!",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "post_002",
    userId: "user_002",
    userName: "Ankit Patel",
    userAvatar: "🐕",
    petName: "Milo",
    content: "Found the perfect hiking trail for dogs today. Milo absolutely loved it! Highly recommend Cubbon Park early morning walks.",
    likes: ["user_001", "user_003", "user_004"],
    comments: [],
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "post_003",
    userId: "user_003",
    userName: "Sneha Menon",
    userAvatar: "🐱",
    petName: "Luna",
    content: "Luna discovered she loves watermelon! 🍉 Who knew cats could be so funny about fruit.",
    likes: ["user_001"],
    comments: [
      {
        id: "cmt_002",
        userId: "user_001",
        userName: "Priya Sharma",
        userAvatar: "🐾",
        text: "Luna is adorable! 💕",
        timestamp: new Date(Date.now() - 9000000).toISOString(),
      },
    ],
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
];

const DEMO_ADOPTION_PETS: AdoptionPet[] = [
  {
    id: "adopt_001",
    name: "Max",
    species: "dog",
    breed: "Golden Retriever Mix",
    age: "2 years",
    gender: "male",
    description: "Max is a playful and friendly dog who loves kids. He's been with us for 3 months and is fully house-trained. Great with other dogs!",
    shelterName: "Sunshine Animal Shelter",
    shelterContact: "+91 98765 43210",
    location: "Bangalore",
    status: "available",
    image: "🐕",
    vaccinated: true,
    neutered: true,
    goodWithKids: true,
    goodWithPets: true,
    adoptionFee: 1500,
  },
  {
    id: "adopt_002",
    name: "Cleo",
    species: "cat",
    breed: "Domestic Shorthair",
    age: "1 year",
    gender: "female",
    description: "Cleo is a gentle and affectionate cat who loves cuddles. She's great with other cats and enjoys watching birds through windows.",
    shelterName: "Paws & Love Rescue",
    shelterContact: "+91 87654 32109",
    location: "Mumbai",
    status: "available",
    image: "🐈",
    vaccinated: true,
    neutered: true,
    goodWithKids: true,
    goodWithPets: true,
    adoptionFee: 1000,
  },
  {
    id: "adopt_003",
    name: "Rocky",
    species: "dog",
    breed: "Indian Pariah",
    age: "4 years",
    gender: "male",
    description: "Rocky is a street dog rescue who has been rehabilitated. He's loyal, intelligent, and has learned many tricks. Needs a patient owner.",
    shelterName: "Street Paws Foundation",
    shelterContact: "+91 76543 21098",
    location: "Delhi",
    status: "available",
    image: "🐶",
    vaccinated: true,
    neutered: true,
    goodWithKids: false,
    goodWithPets: false,
    adoptionFee: 0,
  },
  {
    id: "adopt_004",
    name: "Bella",
    species: "rabbit",
    breed: "Holland Lop",
    age: "8 months",
    gender: "female",
    description: "Bella is a curious and gentle rabbit. She loves to explore and enjoys gentle handling. Perfect for families looking for a quiet pet.",
    shelterName: "Small Friends Rescue",
    shelterContact: "+91 65432 10987",
    location: "Pune",
    status: "available",
    image: "🐰",
    vaccinated: false,
    neutered: false,
    goodWithKids: true,
    goodWithPets: false,
    adoptionFee: 800,
  },
];

const DEMO_LOST_FOUND: LostFoundPet[] = [
  {
    id: "lf_001",
    type: "lost",
    petName: "Tommy",
    species: "dog",
    breed: "Beagle",
    description: "Lost near MG Road. Brown and white Beagle, wearing a blue collar with tag. Very friendly. Last seen near the park.",
    location: "MG Road, Bangalore",
    date: "2026-03-08",
    contactName: "Ravi Kumar",
    contactPhone: "+91 99887 76655",
    reward: 5000,
    status: "active",
    image: "🐕",
    userId: "user_001",
  },
  {
    id: "lf_002",
    type: "found",
    petName: "Unknown",
    species: "cat",
    breed: "Tabby",
    description: "Found a tabby cat near Indiranagar. Orange and white, no collar. Very tame and friendly. Please claim if this is your pet.",
    location: "Indiranagar, Bangalore",
    date: "2026-03-09",
    contactName: "Meera S",
    contactPhone: "+91 88776 65544",
    status: "active",
    image: "🐱",
    userId: "user_002",
  },
];

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS);
  const [adoptionPets] = useState<AdoptionPet[]>(DEMO_ADOPTION_PETS);
  const [lostFoundPets, setLostFoundPets] = useState<LostFoundPet[]>(DEMO_LOST_FOUND);

  const addPost = (postData: Omit<Post, "id" | "timestamp" | "likes" | "comments">) => {
    const newPost: Post = {
      ...postData,
      id: generateId("post"),
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const toggleLike = (postId: string, userId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: p.likes.includes(userId)
                ? p.likes.filter((id) => id !== userId)
                : [...p.likes, userId],
            }
          : p
      )
    );
  };

  const addComment = (postId: string, comment: Omit<Comment, "id" | "timestamp">) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { ...comment, id: generateId("cmt"), timestamp: new Date().toISOString() },
              ],
            }
          : p
      )
    );
  };

  const addLostFound = (pet: Omit<LostFoundPet, "id">) => {
    setLostFoundPets((prev) => [{ ...pet, id: generateId("lf") }, ...prev]);
  };

  const updateLostFoundStatus = (id: string, status: "active" | "resolved") => {
    setLostFoundPets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  return (
    <CommunityContext.Provider
      value={{
        posts,
        adoptionPets,
        lostFoundPets,
        addPost,
        toggleLike,
        addComment,
        addLostFound,
        updateLostFoundStatus,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) throw new Error("useCommunity must be used within CommunityProvider");
  return context;
}
