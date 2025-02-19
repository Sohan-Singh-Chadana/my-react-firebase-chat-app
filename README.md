/ Handle adding a new chat
  const handleAdd = useCallback(async () => {
    if (!user || existingChats.has(user.userId)) return;

    try {
      const chatsRef = collection(db, "chats");
      const usersRef = collection(db, "users");

      // ✅ Pehle check karo ki chat already exist karti hai ya nahi
      const q = query(
        chatsRef,
        where("participants", "array-contains", currentUser.userId)
      );
      const querySnapshot = await getDocs(q);

      let existingChat = null;
      querySnapshot.forEach((doc) => {
        const chat = doc.data();
        if (chat.participants.includes(user.userId)) {
          existingChat = { id: doc.id, ...chat };
        }
      });

      let chatId;
      if (existingChat) {
        chatId = existingChat.id; // ✅ Agar chat exist karti hai to usi chat ko use karenge
      } else {
        // ✅ Naya chat create karna
        const newChatRef = doc(chatsRef);
        chatId = newChatRef.id;

        await setDoc(newChatRef, {
          chatId,
          participants: [currentUser.userId, user.userId],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          deletedBy: [], // ✅ Pehle koi delete nahi karega
        });
      }

      // ✅ Current user ki chatList update karo
      const currentUserRef = doc(usersRef, currentUser.userId);
      const currentUserSnap = await getDoc(currentUserRef);
      const currentChatList = currentUserSnap.exists()
        ? currentUserSnap.data().chatList || []
        : [];

      // ✅ Receiver (doosre user) ki chatList update karo
      const receiverUserRef = doc(usersRef, user.userId);
      const receiverUserSnap = await getDoc(receiverUserRef);
      const receiverChatList = receiverUserSnap.exists()
        ? receiverUserSnap.data().chatList || []
        : [];

      // ✅ Dono users ke chatLists update karo
      const newChatData = {
        chatId,
        lastMessage: "",
        updatedAt: new Date(),
        receiverId: user.userId,
      };

      await updateDoc(currentUserRef, {
        chatList: [...currentChatList, newChatData],
      });

      await updateDoc(receiverUserRef, {
        chatList: [
          ...receiverChatList,
          { ...newChatData, receiverId: currentUser.userId },
        ],
      });

      // ✅ State update karna
      setExistingChats((prev) => new Set([...prev, user.userId]));
      setUser(null);
    } catch (err) {
      console.error("❌ Error adding user to chat:", err);
      setError("Error adding user.");
    }
  }, [user, currentUser.userId, existingChats]);