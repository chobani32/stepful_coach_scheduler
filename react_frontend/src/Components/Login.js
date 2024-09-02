import '../Style.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isCoach, setIsCoach] = useState(true);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    if (isCoach) {
      navigate('/coach/' + user);
    } else {
      navigate('/student/' + user);
    }
  };

  useEffect(() => {
    if (isCoach) {
      console.log("user set as Coach")
    } else {
      console.log("user set as Student")
    }
  }, [isCoach]);

  useEffect(() => {
    console.log("user: " + user)
  }, [user]);

  return (
    <div className="center">
      <br></br>
      <br></br>
      <button className={isCoach ? "b_selected" : "b_unselected"} onClick={() => setIsCoach(true)}>Coach</button>
      <button className={isCoach ? "b_unselected" : "b_selected"} onClick={() => setIsCoach(false)}>Student</button>
      <br></br>
      <br></br>
      <input type="text" onChange={(u) => setUser(u.target.value)}></input>
      <br></br>
      <br></br>
      <button onClick={handleClick}>Submit</button>
    </div>
  );
}

export default Login;
