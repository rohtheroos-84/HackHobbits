import React, { useState, useEffect, useCallback } from "react";
import Particles from "./components/Particles"; // Particle background component
import GradientText from "./GradientText"; // Gradient text component
import DecryptedText from "./DecryptedText"; // Decryption effect component
import RotatingText from "./RotatingText"; // Rotating text component
import SplitText from "./SplitText"; // Split-text animation component
import "./App.css"; // Global styles

// Example team members data for the About Us section
const teamMembers = [
  {
    name: "Yadeesh T",
    github: "https://github.com/Yadeesht",
    linkedin: "https://www.linkedin.com/in/yadeesh-t-259640288",
    email: "yadeesh005@gmail.com",
    image: "/dp.jpg",
  },
  {
    name: "Gokul Ram K",
    github: "https://github.com/GOKULRAM-K",
    linkedin: "https://www.linkedin.com/in/gokul-ram-k-277a6a308 ",
    email: "gokul.ram.kannan210905@gmail.com",
    image: "/dp.jpg",
  },
  {
    name: "Rohit N",
    github: "https://github.com/rohtheroos-84",
    linkedin: "https://www.linkedin.com/in/rohit-n-1b0984280",
    email: "rohit84.official@gmail.com",
    image: "/dp.jpg",
  },
  {
    name: "Rahul B",
    github: "https://github.com/RahulB-24",
    linkedin: "www.linkedin.com/in/rahul-balachandar-a9436a293",
    email: "rahulbalachandar24@gmail.com",
    image: "/dp.jpg",
  },
];

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

function App() {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  // State to force re-mounting the SplitText component so the title animation re-runs
  const [homeKey, setHomeKey] = useState(0);

  // Smooth scroll function (update the scroll offset if needed)
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

  // Highlight nav links based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const navLinks = document.querySelectorAll(".nav-links a");
      const scrollPos = window.scrollY + 80;
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

  // Observer to update homeKey every time the home section comes into view
  useEffect(() => {
    const homeSection = document.getElementById("home");
    if (!homeSection) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Update the key to re-mount SplitText and trigger its animation
          setHomeKey((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(homeSection);
    return () => observer.disconnect();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (
        !selectedFile.type.startsWith("video/") &&
        !selectedFile.type.startsWith("image/")
      ) {
        alert("Invalid file type. Please upload a video or image.");
        return;
      }
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  // New function: Handle drag over to allow drop
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // New function: Handle drop event to process dragged files
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (
        !droppedFile.type.startsWith("video/") &&
        !droppedFile.type.startsWith("image/")
      ) {
        alert("Invalid file type. Please upload a video or image.");
        return;
      }
      setFile(droppedFile);
      setFileURL(URL.createObjectURL(droppedFile));
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
      <Particles />
      <nav className="navbar" id="main-nav">
        <div className="logo">
          <span className="logo-static">Hack</span>
          <RotatingText
            texts={["Hobbits", "Hub'25"]}
            mainClassName="rotating-text"
            staggerFrom="last"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-120%", opacity: 0 }}
            staggerDuration={0.025}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>
        <ul className="nav-links">
          <li>
            <a href="#home" onClick={handleSmoothScroll}>
              Home
            </a>
          </li>
          <li>
            <a href="#architecture" onClick={handleSmoothScroll}>
              Architecture
            </a>
          </li>
          <li>
            <a href="#about" onClick={handleSmoothScroll}>
              About Us
            </a>
          </li>
        </ul>
      </nav>
      <section id="home" className="container">
        {/* The key prop forces a re-mount so that the SplitText animation runs each time */}
        <SplitText
          key={homeKey}
          text="Deepfake Detector"
          className="split-title"
          delay={20}
          animationFrom={{ opacity: 0, transform: "translate3d(0,20px,0)" }}
          animationTo={{ opacity: 1, transform: "translate3d(0,0,0)", color: "white" }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-20px"
          onLetterAnimationComplete={handleAnimationComplete}
        />
        <br />
        <br />
        <div
          className="upload-box"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="video/*,image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
        {fileURL && (
          <div className="media-preview">
            {file.type.startsWith("video/") ? (
              <video src={fileURL} controls autoPlay loop className="media" />
            ) : (
              <img src={fileURL} alt="Uploaded Preview" className="media" />
            )}
          </div>
        )}
        <br />
        <br />
        <button className="detect-btn" onClick={handleDetect} disabled={loading}>
          {loading ? "Analyzing..." : "Detect Deepfake"}
        </button>
        {result && (
          <div className={`result ${result.includes("Deepfake") ? "fake" : "real"}`}>
            {result}
          </div>
        )}
      </section>
      <section id="architecture">
        <h2>Architecture</h2>
        <p>More content goes here...</p>
      </section>
      <section id="about">
        <h2>About Us</h2>
        <br />
        <br />
        <div className="cards-container">
          {teamMembers.map((member, index) => (
            <div key={index} className="card">
              <img src={member.image} alt="Profile" className="profile-pic" />
              <h3>
                <br />
                <DecryptedText
                  text={member.name}
                  animateOn="view"
                  revealDirection="start"
                  style={{ fontSize: "24px", color: "white" }} // Inline CSS for this instance
                />
                <br />
              </h3>
              <p>
                <a href={member.github} target="_blank" rel="noopener noreferrer">
                  <br />
                  <DecryptedText
                    text="GitHub"
                    animateOn="view"
                    revealDirection="start"
                  />
                </a>{" "}
                |{" "}
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <DecryptedText
                    text="LinkedIn"
                    animateOn="view"
                    revealDirection="start"
                  />
                </a>
              </p>
              <p className="email">
                <DecryptedText
                  text={member.email}
                  animateOn="view"
                  revealDirection="start"
                />
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
