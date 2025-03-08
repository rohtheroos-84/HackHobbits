import React, { useState, useEffect, useCallback } from "react";
import Particles from "./components/Particles"; // Import OGL particle background
import GradientText from "./GradientText"; // Import GradientText component
import "./App.css"; // Import styles

// Team members data
const teamMembers = [
  {
    name: "Name 1",
    github: "https://github.com/user1",
    linkedin: "https://linkedin.com/in/user1",
    email: "name_1@gmail.com",
    image: "/dp.jpg", // Correct path from public folder
  },
  {
    name: "Name 2",
    github: "https://github.com/user2",
    linkedin: "https://linkedin.com/in/user2",
    email: "name_2@gmail.com",
    image: "/dp.jpg",
  },
  {
    name: "Name 3",
    github: "https://github.com/user3",
    linkedin: "https://linkedin.com/in/user3",
    email: "name_3@gmail.com",
    image: "/dp.jpg",
  },
  {
    name: "Name 4",
    github: "https://github.com/user4",
    linkedin: "https://linkedin.com/in/user4",
    email: "name_4@gmail.com",
    image: "/dp.jpg",
  },
];

function App() {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const navLinks = document.querySelectorAll(".nav-links a");
      let scrollPos = window.scrollY + 80;

      sections.forEach((section) => {
        if (
          section.offsetTop <= scrollPos &&
          section.offsetTop + section.offsetHeight > scrollPos
        ) {
          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").substring(1) === section.id) {
              link.classList.add("active");
            }
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = useCallback((event) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 60,
        behavior: "smooth",
      });
    }
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      if (!selectedFile.type.startsWith("video/") && !selectedFile.type.startsWith("image/")) {
        alert("Invalid file type. Please upload a video or image.");
        return;
      }

      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleDetect = () => {
    if (!file) {
      alert("Please upload a video/image first.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const isDeepfake = Math.random() < 0.5;
      setResult(isDeepfake ? "Deepfake Detected ❌" : "Real Content ✅");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="app">
      {/* OGL Particle Background */}
      <Particles />

      {/* Navigation Bar */}
      <nav className="navbar" id="main-nav">
        <div className="logo">
          <GradientText
            colors={["#8F1DA3", "#FFFFFF", "#8F1DA3", "#FFFFFF", "#8F1DA3"]}
            animationSpeed={3}
            showBorder={false}
            className="gradient-logo"
          >
            HackHobbits
          </GradientText>
        </div>
        <ul className="nav-links">
          <li><a href="#home" onClick={handleSmoothScroll}>Home</a></li>
          <li><a href="#architecture" onClick={handleSmoothScroll}>Architecture</a></li>
          <li><a href="#about" onClick={handleSmoothScroll}>About Us</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <section id="home" className="container">
        <h1 className="title">Deepfake Detector</h1>

        <div className="upload-box">
          <input
            type="file"
            accept="video/*,image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        {/* Display Video/Image if Uploaded */}
        {fileURL && (
          <div className="media-preview">
            {file.type.startsWith("video/") ? (
              <video src={fileURL} controls autoPlay loop className="media" />
            ) : (
              <img src={fileURL} alt="Uploaded Preview" className="media" />
            )}
          </div>
        )}
        <br /><br />
        <button className="detect-btn" onClick={handleDetect} disabled={loading}>
          {loading ? "Analyzing..." : "Detect Deepfake"}
        </button>

        {result && <div className={`result ${result.includes("Deepfake") ? "fake" : "real"}`}>{result}</div>}
      </section>

      {/* Architecture Section */}
      <section id="architecture">
        <h2>Architecture</h2>
        <p>More content goes here...</p>
      </section>

      {/* About Us Section */}
      <section id="about">
        <h2>About Us</h2>
        <br /><br />
        <div className="cards-container">
          {teamMembers.map((member, index) => (
            <div key={index} className="card">
              <img src={member.image} alt="Profile" className="profile-pic" />
              <h3><br />{member.name}<br /></h3>
              <p>
                <a href={member.github} target="_blank" rel="noopener noreferrer">
                  <br /> GitHub
                </a>{" "}
                |{" "}
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <br />
                </a>
              </p>
              <br />
              <p className="email">{member.email}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
  