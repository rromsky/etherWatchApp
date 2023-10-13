import Logo from "../stock/Logo";

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
export default NavBar;
