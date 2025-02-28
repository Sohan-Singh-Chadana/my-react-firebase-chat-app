import LogoutConfirmModal from "../../auth/LogoutConfirmModal";

const Logout = ({ className = "", element: Element = "span" }) => {
  return (
    <LogoutConfirmModal
      trigger={(openModal) => (
        <Element className={className} onClick={openModal}>
          Logout
        </Element>
      )}
    />
  );
};
export default Logout;
