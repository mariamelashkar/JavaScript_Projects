// App.js
import React, { useCallback,useContext, useState, useEffect } from 'react';
import { Form, Input, Button, List, Card, Space, message } from 'antd';
import { MyContext, MyProvider } from './components/MyContext';
//import 'antd/dist/antd.css';

const Book = ({ book, checkInBook, checkOutBook }) => {
  return (
    <Card
      title={book.name}
      extra={`ID: ${book.id}`}
      style={{ marginBottom: 16 }}
    >
      <p>Author: {book.author}</p>
      <p>Quantity: {book.quantity}</p>
      <Space>
        <Button type="primary" onClick={() => checkInBook(book.name)}>Check In</Button>
        <Button type="danger" onClick={() => checkOutBook(book.name)}>Check Out</Button>
      </Space>
    </Card>
  );
};

const App = () => {
  const { books, setBooks, currentId, setCurrentId } = useContext(MyContext);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAndRenderData = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/getbook', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setBooks([]);  // Ensure books is set to an empty array on error
    }
  }, [setBooks]);

  useEffect(() => {
    fetchAndRenderData();
  }, [fetchAndRenderData]);

  const addBook = async (values) => {
    const { name, author, quantity } = values;
    const newBook = {
      id: currentId.toString(),
      name,
      author,
      quantity: parseInt(quantity, 10),
    };

    try {
      const response = await fetch('http://localhost:8000/createbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });

      if (response.status === 201) {
        setCurrentId(currentId + 1);
        fetchAndRenderData();
        message.success('Book added successfully!');
      } else {
        console.error('Error adding book:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const checkInBook = async (bookName) => {
    try {
      const response = await fetch(`http://localhost:8000/getbookcheckin/${bookName}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        fetchAndRenderData();
        message.success('Book checked in successfully!');
      } else {
        console.error('Error checking in book:', response.statusText);
      }
    } catch (error) {
      console.error('Error checking in book:', error);
    }
  };

  const checkOutBook = async (bookName) => {
    try {
      const response = await fetch(`http://localhost:8000/getbookcheckout/${bookName}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        fetchAndRenderData();
        message.success('Book checked out successfully!');
      } else {
        console.error('Error checking out book:', response.statusText);
      }
    } catch (error) {
      console.error('Error checking out book:', error);
    }
  };

  // Initialize books to an empty array if it's null
  const filteredBooks = (books || []).filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>Library Management System</h1>

      <div style={{ marginBottom: 24 }}>
        <h2>Add Book</h2>
        <Form layout="inline" onFinish={addBook}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input the book name!' }]}
          >
            <Input placeholder="Book Name" />
          </Form.Item>
          <Form.Item
            name="author"
            rules={[{ required: true, message: 'Please input the author!' }]}
          >
            <Input placeholder="Author" />
          </Form.Item>
          <Form.Item
            name="quantity"
            rules={[{ required: true, message: 'Please input the quantity!' }]}
          >
            <Input type="number" placeholder="Quantity" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add Book</Button>
          </Form.Item>
        </Form>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h2>Search Books</h2>
        <Input
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <div>
        <h2>All Books</h2>
        <Button type="primary" onClick={fetchAndRenderData}>View All Books</Button>
        <List
          dataSource={filteredBooks}
          renderItem={(book) => (
            <List.Item>
              <Book key={book.id} book={book} checkInBook={checkInBook} checkOutBook={checkOutBook} />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

const WrappedApp = () => (
  <MyProvider>
    <App />
  </MyProvider>
);

export default WrappedApp;
