import React from "react";
import "./Card.css"; // Import the CSS file for the card component
import SmallIcons from "./components/SmallIcons"; // Assuming you have this component

const Card = ({ name, email, phone, github, linkedin }) => {
  return (
    <div className="card">
      <h3>{name}</h3>
      <SmallIcons /> {/* Render your SmallIcons component */}
      <p>
        Email:{" "}
        <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
          {email}
        </a>
      </p>
      <p>
        Phone: <a href={`tel:${phone}`}>{phone}</a>
      </p>
      <p>
        GitHub:{" "}
        <a href={github} target="_blank" rel="noopener noreferrer">
          Profile
        </a>
      </p>
      <p>
        LinkedIn:{" "}
        <a href={linkedin} target="_blank" rel="noopener noreferrer">
          Profile
        </a>
      </p>
    </div>
  );
};

export default Card;