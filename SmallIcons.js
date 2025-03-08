import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faGithub, faLinkedin } from "@fortawesome/free-solid-svg-icons";
import { faGithub as fabGithub, faLinkedin as fabLinkedin } from "@fortawesome/free-brands-svg-icons";

function SmallIcons() {
    return (
        <div>
            <FontAwesomeIcon icon={faEnvelope} /> {/* Email */}
            <FontAwesomeIcon icon={faPhone} /> {/* Phone */}
            <FontAwesomeIcon icon={fabGithub} /> {/* GitHub */}
            <FontAwesomeIcon icon={fabLinkedin} /> {/* LinkedIn */}
        </div>
    );
}

export default SmallIcons;
