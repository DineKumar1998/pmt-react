import PersonCard from "@assets/icons/person.svg";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const Illustration = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="card illustration">
      <div className="content">
        <p>Welcome {user.user_type}</p>
        <h2>{user.user_name}</h2>
        <p>
          your centralized hub for managing users, applications, and system
          operations.
        </p>
      </div>
      <div className="person-icon">
        <img src={PersonCard} />
      </div>
    </div>
  );
};

export default Illustration;
