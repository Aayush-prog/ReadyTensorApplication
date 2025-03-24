import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import ClientHome from "./ClientHome";
import DevHome from "./DevHome";

export default function Home() {
  const { role } = useContext(AuthContext);

  if (role === "client") {
    return <ClientHome />;
  }

  if (role === "developer") {
    return <DevHome />;
  }

  return <div>Loading...</div>; // Or some default component
}
