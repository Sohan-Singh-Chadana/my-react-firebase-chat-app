import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase/firebase";
import { useChatStore, useUserStore } from "../../../store";
import Modal from "../modal/Modal";

const BlockAction = ({ showConfirm, setShowConfirm }) => {
  const { currentUser } = useUserStore();
  const { user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const isBlocking = !(isCurrentUserBlocked || isReceiverBlocked);

  const cancelBlocked = () => {
    setShowConfirm(false);
  };
  const confirmBlocked = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.userId);

    try {
      await updateDoc(userDocRef, {
        blockedUsers: isReceiverBlocked
          ? arrayRemove(user.userId)
          : arrayUnion(user.userId),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
    setShowConfirm(false);
  };

  return (
    <>
      <Modal
        isOpen={showConfirm}
        onClose={cancelBlocked}
        onConfirm={confirmBlocked}
        title={`${isBlocking ? "Block" : "Unblock"}  ${user?.name}?`}
        description={`Are you sure you want to ${
          isBlocking ? "block" : "unblock"
        } ${user?.name}? This action is irreversible.`}
        confirmText={`${isBlocking ? "Block" : "Unblock"}`}
        cancelText="Cancel"
      />
    </>
  );
};

export default BlockAction;
