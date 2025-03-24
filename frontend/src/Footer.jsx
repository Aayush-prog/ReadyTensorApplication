import React from "react";
import logo from "../src/assets/devx.png";
export default function Footer() {
  return (
    <footer className="bg-primary text-white py-6 ">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} DevX. All rights reserved.</p>
      </div>
    </footer>
  );
}
