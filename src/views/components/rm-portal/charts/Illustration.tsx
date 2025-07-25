import PersonCard from "@assets/Persons.png";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";

const RMIllustration = () => {
  const {user} = useContext(AuthContext)
  return (
    <div className="card illustration">
      <div className="content">
        <p>Welcome {user.user_type}</p>
        <h2>{user.user_name}</h2>
        <p>
        We're excited to have you here. This is your personalized dashboard where you can easily access everything you need.
        </p>
      </div>
      <div className="person-icon">
        <img src={PersonCard} />
      </div>
    </div>
  );
};

export default RMIllustration;
