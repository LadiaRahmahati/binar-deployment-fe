import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../slices/userSlice";

function About() {
    const userRedux = useSelector(selectUser);
    const [user, setUser] = useState(userRedux.creds);
    return (
        <div>
            <p>Selamat Datang {user.name}</p>
            <Link to="/">Home Page</Link>
        </div>
    );
}

export default About;