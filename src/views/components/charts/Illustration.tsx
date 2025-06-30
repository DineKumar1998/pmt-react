import PersonCard from "@assets/icons/person.svg";
import { AUTH } from "@/utils/constants";

const Illustration = () => {
  return (
    <div className="card illustration">
      <div className="content">
        <p>Welcome {localStorage.getItem(AUTH.USER_TYPE)}</p>
        <h2>{localStorage.getItem(AUTH.USER_NAME)}</h2>
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
