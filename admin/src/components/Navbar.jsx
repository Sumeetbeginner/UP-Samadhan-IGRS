import { Link } from 'react-router-dom';
import '../styles/main.css';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm p-4">
      <div className="container flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary-color">UP Samadhan (ADMIN)</h1>
        <div className="flex gap-4">
          <Link to="/" className="text-dark-color hover:text-primary-color font-medium">
            Dashboard
          </Link>
          <Link to="/status" className="text-dark-color hover:text-primary-color font-medium">
            Status
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;