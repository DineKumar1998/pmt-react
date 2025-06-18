import PersonCard from "@assets/icons/person.svg";

const Illustration = () => {
  return (
    <div className="card illustration">
      <div className="content">
        <p>Welcome Admin</p>
        <h2>Sakonji Urokodaki</h2>
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
