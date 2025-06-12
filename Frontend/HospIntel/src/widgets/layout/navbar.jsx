import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Navbar as MTNavbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

export function Navbar({ brandName, routes, action }) {
  const [openNav, setOpenNav] = React.useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const handleServicesClick = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const servicesMenu = (
    <div className="relative">
      <button
        onClick={handleServicesClick}
        className="flex items-center gap-1 p-1 font-bold text-lg text-inherit hover:text-blue-gray-200"
      >
        Services
        <ChevronDownIcon className="w-4 h-4" />
      </button>
      {isServicesOpen && (
        <div className="absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white border border-gray-100">
          <div className="py-1" role="menu">
            <Link
              to="/hospital-profiling"
              className="block w-full font-bold text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              role="menuitem"
            >
              Hospital Profiling
            </Link>
            <Link
              to="/hospital-impact-analysis"
              className="block w-full font-bold text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              role="menuitem"
            >
              Hospital Impact Analysis
            </Link>
            <Link
              to="/hospital-due-diligence"
              className="block w-full font-bold text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              role="menuitem"
            >
              Hospital Due Diligence
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {routes.map(({ name, path, icon, href, target }) => (
        <Typography
          key={name}
          as="li"
          variant="paragraph"
          color="inherit"
          className="capitalize"
        >
          {name === "Services" ? (
            servicesMenu
          ) : href ? (
            <a
              href={href}
              target={target}
              className="flex items-center gap-1 p-1 font-bold text-lg text-inherit hover:text-blue-gray-200"
            >
              {icon &&
                React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
              {name}
            </a>
          ) : (
            <Link
              to={path}
              target={target}
              className="flex items-center gap-1 p-1 font-bold text-lg text-inherit hover:text-blue-gray-200"
            >
              {icon &&
                React.createElement(icon, {
                  className: "w-[18px] h-[18px] opacity-75 mr-1",
                })}
              {name}
            </Link>
          )}
        </Typography>
      ))}
    </ul>
  );

  return (
    <MTNavbar 
      color="transparent" 
      className="absolute top-0 z-[9999] h-max max-w-full rounded-none px-4 py-3 shadow-none"
      shadow={false}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/img/logo.png"
              alt="Logo"
              className="h-10 w-auto block md:hidden"
            />
            <Typography className="cursor-pointer py-1.5 mt-[-8px] font-bold text-xl md:text-2xl text-inherit">
              {brandName}
            </Typography>
          </Link>
        </div>
        <div className="hidden lg:block">{navList}</div>
        <div className="hidden md:flex gap-2 items-center">
          <img
            src="/img/logo.png"
            alt="Logo"
            className="h-16 w-25"
          />
        </div>
        <IconButton
          variant="text"
          size="sm"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav} className="rounded-xl px-4 pt-2 pb-4 bg-transparent backdrop-blur-sm lg:hidden">
        <div className="container mx-auto">
          {navList}
        </div>
      </Collapse>
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: "HospIntel",
  action: (
    <a
      href="https://www.creative-tim.com/product/material-tailwind-kit-react"
      target="_blank"
    >
    </a>
  ),
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.node,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;
