// MainPage.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

function MainPage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://localhost:8000")); // Connect to the server
  }, []);
  useEffect(() => {

    console.log(user);
    if (!user) {
      console.error("No user data found");
      return;
    }
    
    // Send initialization event to server
    socket?.emit("initialize", user?.id);
    console.log(user);
    const messageListener = (msg) => {
      const message = JSON.stringify(msg);
      console.log("Message received: ", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const notificationListener = (notification) => {
      console.log("Notification received: ", notification);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    };

    socket?.on("getMessage", messageListener);
    socket?.on("getNotification", notificationListener);


    return () => {
      socket?.off("getMessage", messageListener);
      socket?.off("getNotification", notificationListener);
    };
  }, [socket, user]); // Add user as a dependency

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div className="App">
      <h1>Welcome, {user.name || user.email}</h1>
      <h2>Socket.IO Message and Notification Receiver</h2>
      <div>
        <h3>Messages from server:</h3>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Notifications from server:</h3>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MainPage;
