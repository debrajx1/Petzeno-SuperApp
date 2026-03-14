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

export type FoodSharePost = {
  id: string;
  organizer: string;
  location: string;
  foodType: string;
  quantity: string;
  pickupTime: string;
  contact: string;
  timestamp: string;
  status: "Available" | "Rescue in Progress" | "Completed";
};

type CommunityContextType = {
  posts: Post[];
  adoptionPets: AdoptionPet[];
  lostFoundPets: LostFoundPet[];
  foodSharePosts: FoodSharePost[];
  addPost: (post: Omit<Post, "id" | "timestamp" | "likes" | "comments">) => void;
  toggleLike: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, "id" | "timestamp">) => void;
  addLostFound: (pet: Omit<LostFoundPet, "id">) => void;
  updateLostFoundStatus: (id: string, status: "active" | "resolved") => void;
  addFoodShare: (post: Omit<FoodSharePost, "id" | "timestamp" | "status">) => void;
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
  {
    id: "lf_003",
    type: "lost",
    petName: "Sharku",
    species: "dog",
    breed: "Husky",
    description: "Lost our beautiful Husky, Sharku, near Koramangala. He has very distinct blue eyes and a thick grey/white coat. Very friendly but easily distracted.",
    location: "Koramangala, Bangalore",
    date: "2026-03-12",
    contactName: "Ajay S",
    contactPhone: "+91 99887 11223",
    reward: 10000,
    status: "active",
    image: "🐕",
    userId: "user_003",
  },
];

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
}

import { getApiUrl } from "@/lib/query-client";

export function CommunityProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [adoptionPets, setAdoptionPets] = useState<AdoptionPet[]>([]);
  const [lostFoundPets, setLostFoundPets] = useState<LostFoundPet[]>([]);
  const [foodSharePosts, setFoodSharePosts] = useState<FoodSharePost[]>([
    {
      id: "food_1",
      organizer: "Rajesh Kumar",
      location: "MG Road, Bangalore",
      foodType: "Rice, Dal & Sabzi",
      quantity: "For 40-50 people",
      pickupTime: "Before 10:30 PM",
      contact: "+91 99880 11223",
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      status: "Available",
    },
    {
      id: "food_2",
      organizer: "Global Tech Park Event",
      location: "Whitefield, Bangalore",
      foodType: "Continental Mix (Pastas, Breads)",
      quantity: "For 100 people",
      pickupTime: "Before 12:00 AM",
      contact: "+91 88776 65544",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "Rescue in Progress",
    },
  ]);
  const apiUrl = getApiUrl();

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const postsRes = await fetch(`${apiUrl}/api/community`);
      const rawPosts = await postsRes.json();
      // Map backend to frontend schema
      const mappedPosts = rawPosts.map((p: any) => ({
        id: p._id,
        userId: p.authorId,
        userName: p.author,
        userAvatar: p.authorAvatar || "🐾",
        petName: p.petName || "Pet",
        content: p.text,
        image: p.image,
        likes: p.likes || [],
        comments: p.comments || [],
        timestamp: p.createdAt
      }));
      setPosts(mappedPosts);

      const adoptRes = await fetch(`${apiUrl}/api/listings?type=adoption`);
      const rawAdopt = await adoptRes.json();
      const mappedAdopt = rawAdopt.map((p: any) => ({
        id: p._id,
        name: p.name,
        species: p.species || "dog",
        breed: p.breed || "Mix",
        age: p.age || "Unknown",
        gender: "male", // default or add to backend
        description: p.description,
        shelterName: "Petzeno Shelter",
        location: p.location || "Local",
        status: p.status === "Available" ? "available" : "adopted",
        image: p.imageUrl || "🐶",
        vaccinated: true,
        adoptionFee: 0
      }));
      setAdoptionPets(mappedAdopt);

      const lfRes = await fetch(`${apiUrl}/api/listings?type=lost-found`);
      const rawLF = await lfRes.json();
      const mappedLF = rawLF.map((p: any) => ({
        id: p._id,
        type: p.status === "Found" ? "found" : "lost",
        petName: p.name,
        species: p.species,
        breed: p.breed,
        description: p.description,
        location: p.location,
        status: "active",
        image: p.imageUrl || "🐾",
        contactPhone: p.contactPhone || "999-999-9999",
        userId: "user_web"
      }));
      setLostFoundPets(mappedLF);
    } catch (err) {
      console.error("Community fetch failed:", err);
    }
  };

  const addPost = async (postData: Omit<Post, "id" | "timestamp" | "likes" | "comments">) => {
    try {
      await fetch(`${apiUrl}/api/community`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: postData.userId,
          author: postData.userName,
          authorAvatar: postData.userAvatar,
          petName: postData.petName,
          text: postData.content,
        })
      });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLike = async (postId: string, userId: string) => {
    // Simple local toggle for immediate feedback
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      likes: p.likes.includes(userId) ? p.likes.filter(id => id !== userId) : [...p.likes, userId]
    } : p));
    // In real app, send PATCH to backend
  };

  const addComment = async (postId: string, comment: Omit<Comment, "id" | "timestamp">) => {
    // Similarly implement backend call
    refreshData();
  };

  const addLostFound = async (pet: Omit<LostFoundPet, "id">) => {
    try {
      await fetch(`${apiUrl}/api/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lost-found',
          name: pet.petName,
          species: pet.species,
          breed: pet.breed,
          location: pet.location,
          description: pet.description,
          contactPhone: pet.contactPhone,
          status: pet.type === 'lost' ? 'Lost' : 'Found'
        })
      });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateLostFoundStatus = (id: string, status: "active" | "resolved") => {
    setLostFoundPets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const addFoodShare = (post: Omit<FoodSharePost, "id" | "timestamp" | "status">) => {
    const newPost: FoodSharePost = {
      ...post,
      id: generateId("food"),
      timestamp: new Date().toISOString(),
      status: "Available",
    };
    setFoodSharePosts((prev) => [newPost, ...prev]);
  };

  return (
    <CommunityContext.Provider
      value={{
        posts,
        adoptionPets,
        lostFoundPets,
        foodSharePosts,
        addPost,
        toggleLike,
        addComment,
        addLostFound,
        updateLostFoundStatus,
        addFoodShare,
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
