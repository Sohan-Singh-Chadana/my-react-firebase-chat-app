# 📱 WhatsApp-like Chat Application

A full-featured, real-time chat application built using **React, Firebase Firestore, and Zustand** that replicates the functionality of WhatsApp Web. This app includes features like messaging, media sharing, user blocking, status updates, message read receipts, profile updates, and much more.

---

## 🚀 Features

### ✅ Core Messaging
- **Send and Receive Messages:** Real-time text message exchange.
- **Media Support:** Send and receive images, videos, and documents.
- **Unsent Message Count:** Track and display the count of unsent messages.

### 📸 Media & Document Sharing
- **Image and Video Upload:** Preview images/videos with blurred loading states before sending.
- **Document File Sharing:** Share PDF, DOC, and other document formats.
- **PDF First Page Preview:** Shows the first page of a PDF similar to WhatsApp.
- **File Size Information:** Displays file size and type during preview.
- **Download with CORS Fix:** Enables safe and secure media downloads.

### 🙅‍♂️ User Management
- **Block/Unblock Users:** Prevent users from sending messages when blocked.
- **Online/Offline Status:** Shows real-time user status with "Online" and "Last Seen" indicators.
- **Profile Management:** Add, update, and delete profile picture and 'about' information.
- **Update Profile Picture:** Preview before saving and delete profile picture when necessary.

### 🎨 UI Customization
- **Wallpaper Change:** Customize chat wallpaper for a personalized chat experience.
- **Theme Support:** Switch between light and dark mode seamlessly.
- **Emoji and GIF Support:** Insert emojis and GIFs into messages with ease.

### 🔥 Advanced Chat Functionalities
- **Message Status Indicators:** Displays sent, delivered, and read receipts using tick icons.
- **Delete Messages:** Delete messages for yourself or for everyone.
- **Chat Archiving:** Archive chats to hide them from the main list without deletion.
- **Unread Message Badge:** Displays unread message counts with a badge.
- **Long Text Collapse/Expand:** Automatically collapses long messages with a "Read More" option.

### ⏰ Time & Status
- **Last Seen/Online Status:** Real-time updates on user's last activity.
- **Typing Indicator:** Displays "Typing..." when the other user is typing.
- **Date and Time Format:** Properly formatted time and date for messages.


### 📦 Storage & State Management
- **Zustand for Centralized State:** Manages message states, selected chat, and user data.
- **Optimized Firebase Structure:** Handles Firestore reads and writes efficiently.
- **Image Compression:** Reduces image size before upload for faster message delivery.

---


### 📚 Frontend
- **React** - Component-based UI development.
- **Zustand** - For centralized state management.

### 🔥 Backend & Database
- **Firebase Firestore** - Real-time NoSQL database for storing user data and messages.
- **Firebase Authentication** - User login and registration with secure auth methods.
- **Firebase Storage** - For storing media files and document attachments.

---
