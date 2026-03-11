# PetCare Super App

A production-ready mobile-first pet care application built with Expo React Native (SDK 54) and file-based routing.

## Architecture

- **Frontend**: Expo React Native (SDK 54), TypeScript, file-based routing via expo-router
- **Backend**: Express.js + TypeScript (serves static files & API)
- **State**: React Context (PetContext, CartContext, CommunityContext) + AsyncStorage for persistence
- **Data Fetching**: TanStack React Query
- **Styling**: React Native StyleSheet, teal-green theme (#1E9E7E)

## Features

1. **Home Dashboard** — Stats overview, quick actions, upcoming appointments, recent activity
2. **Pet Profiles** — Add/edit pets with species, breed, age, weight, medical history
3. **Vaccination Tracker** — Per-pet vaccination records with due dates and status
4. **Vet Finder Map** — Location-based vet clinic search with distance and ratings
5. **Appointment Booking** — Modal form to book vet appointments with pet selection
6. **Pet Store Marketplace** — Product catalog with categories, cart, checkout, orders
7. **Adoption Center** — Browse adoptable pets with full detail pages
8. **Lost & Found** — Report and search lost/found pets with contact info and rewards
9. **Community Feed** — Post pet stories, like/comment system
10. **Emergency SOS** — One-tap SOS with pulsing animation and nearest vet contacts
11. **Notifications** — Notification center with type-based icons and read/unread states
12. **Profile Editing** — Edit user name, email, phone, city

## Project Structure

```
app/
  _layout.tsx                    # Root layout with all providers + Stack screens
  (tabs)/
    _layout.tsx                  # NativeTabs (iOS 26 liquid glass) + ClassicTabs fallback
    index.tsx                    # Home Dashboard tab
    pets.tsx                     # Pets list tab
    map.tsx                      # Vet Finder map tab
    store.tsx                    # Pet Store tab
    community.tsx                # Community tab (Feed/Adopt/Lost sub-tabs)
  pet/
    add.tsx                      # Add pet modal
    [id].tsx                     # Pet profile detail
    vaccination/[petId].tsx      # Vaccination tracker
  appointment/
    book.tsx                     # Book appointment modal
  store/
    [id].tsx                     # Product detail
    cart.tsx                     # Shopping cart
    orders.tsx                   # Order history
  adoption/
    index.tsx                    # Adoption listings
    [id].tsx                     # Adoption pet detail
  lost-found/
    index.tsx                    # Lost & found listings
    report.tsx                   # Report lost/found modal
  community/
    post/[id].tsx                # Community post detail with comments
  emergency/
    index.tsx                    # Emergency SOS screen
  notifications/
    index.tsx                    # Notifications center
  profile/
    edit.tsx                     # Edit profile modal
context/
  PetContext.tsx                 # Pets, appointments, notifications, vaccinations
  CartContext.tsx                # Products, cart, orders
  CommunityContext.tsx           # Posts, adoption pets, lost & found
constants/
  colors.ts                      # Theme colors (teal-green primary #1E9E7E)
```

## Design Decisions

- **Primary Color**: #1E9E7E (teal green)
- **Secondary Color**: #FF7B54 (orange)
- **Emergency Color**: #FF3B30 (red)
- **Font**: Inter (400, 500, 600, 700 weights)
- **Tab Bar**: NativeTabs with liquid glass on iOS 26+, BlurView fallback on older iOS/Android
- **Safe Area**: useSafeAreaInsets() throughout; web gets 67px top + 34px bottom insets
- **Icons**: @expo/vector-icons Ionicons
- **Maps**: react-native-maps@1.18.0 (pinned for Expo Go compatibility)
- **UUID**: Date.now() + Math.random() (no uuid package)

## Workflows

- `Start Backend`: Runs Express server on port 5000
- `Start Frontend`: Runs Expo dev server on port 8081 with HMR
