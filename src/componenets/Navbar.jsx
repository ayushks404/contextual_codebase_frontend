import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

export function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
  try {
    await API.post("/auth/logout");
  } catch (e) {
    console.log("Cleanup failed");
  } finally {
    logout(); // clear token
    navigate("/");
  }
};

  

  return (
    <nav className="bg-black text-white px-6 py-3 flex justify-between">
      <div className="font-bold">Codebase Advisor</div>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
