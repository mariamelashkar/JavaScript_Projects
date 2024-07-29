// MyContext.js
import React, { createContext, useState } from 'react';

const MyContext = createContext(null);

const MyProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [currentId, setCurrentId] = useState(1);

  return (
    <MyContext.Provider value={{ books, setBooks, currentId, setCurrentId }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };
