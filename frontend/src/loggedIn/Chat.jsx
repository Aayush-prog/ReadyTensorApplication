import { useContext, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import Nav from "../Nav";
import Footer from "../Footer";
import { FaPhoneAlt } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const api = import.meta.env.VITE_URL;
const socket = io(`${api}`);

function CallPopup({ roomId, onClose, onAccept }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement
        .play()
        .catch((error) => console.error("Audio play error:", error));
      audioElement.loop = true;
    }
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Incoming Call</h2>
        <div className="flex justify-around mt-4">
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
              onAccept();
            }}
            className=" text-green font-bold py-2 px-4 rounded"
          >
            <FaPhoneAlt />
          </button>
          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
              onClose();
            }}
            className="text-red font-bold py-2 px-4 rounded"
          >
            <MdCallEnd />
          </button>
        </div>
      </div>

      {/* Audio element with remote URL */}
      <audio ref={audioRef}>
        <source src="/src/ringtone.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
const Chat = () => {
  const { authToken } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const currentUserId = searchParams.get("currentUser");
  const chatWithUserId = searchParams.get("chatUser");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState();
  const [chatUser, setChatUser] = useState();
  const navigate = useNavigate(); // use navigate hook
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupRoomId, setPopupRoomId] = useState("");

  const openPopup = (roomId) => {
    setPopupRoomId(roomId);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const handleAcceptCall = () => {
    navigate(`/call?roomName=${popupRoomId}`);
    closePopup();
  };

  useEffect(() => {
    const generatedRoomId = [currentUserId, chatWithUserId].sort().join("_");
    setRoomId(generatedRoomId);
    // Start the chat by creating or joining a room
    socket.emit("start_chat", {
      userId1: currentUserId,
      userId2: chatWithUserId,
    });

    // Listen for past messages
    socket.on("past_messages", (pastMessages) => {
      console.log("Received past messages:", pastMessages);
      setMessages(pastMessages); // Set existing messages
    });

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("recieve_call", (data) => {
      openPopup(data.roomId);
    });
    // Clean up when component unmounts
    return () => {
      socket.off("past_messages");
      socket.off("receive_message");
    };
  }, [currentUserId, chatWithUserId]);

  useEffect(() => {
    const fetch = async () => {
      const responseCurrent = await axios.get(
        `${api}/getUser/${currentUserId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setCurrentUser(responseCurrent.data.data);
      const responseChat = await axios.get(`${api}/getUser/${chatWithUserId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setChatUser(responseChat.data.data);
    };
    fetch();
  }, [authToken, api, chatWithUserId, currentUserId]);

  const sendMessage = () => {
    socket.emit("send_message", { roomId, message, senderId: currentUserId });
    setMessage(""); // Clear input only after sending.
  };

  const handleCallClick = () => {
    socket.emit("on_call", { roomId });
    navigate(`/call?roomName=${roomId}`);
  };

  return (
    <div>
      <Nav />
      <div className="flex flex-col h-screen w-full max-w-2xl mx-auto border border-grey">
        <header className="p-4 border-b border-grey text-center flex justify-between">
          <h1 className="text-xl font-semibold text-primary">
            Chat with {chatUser ? chatUser.name : ""}
          </h1>
          <button
            onClick={handleCallClick}
            className="text-green hover:text-green-dark text-2xl"
            aria-label="Start Call"
          >
            <FaPhoneAlt />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {isPopupOpen && (
            <CallPopup
              roomId={popupRoomId}
              onClose={closePopup}
              onAccept={handleAcceptCall}
            />
          )}
          <div className="flex flex-col gap-2">
            {messages.map((msg, idx) => {
              const isCurrentUser = msg.senderId === currentUserId;
              return (
                <div
                  key={msg._id || idx}
                  className={`rounded-xl py-2 px-4 my-1 max-w-fit  ${
                    isCurrentUser
                      ? "bg-green self-end text-white"
                      : "bg-blue self-start text-white"
                  }`}
                >
                  <span className="m-1"> {msg.message || msg.mediaUrl}</span>
                </div>
              );
            })}
          </div>
        </main>

        <footer className="flex p-4 border-t border-grey">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-grey rounded-md p-2 mr-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-green hover:bg-green text-white rounded-md px-4 py-2"
          >
            Send
          </button>
        </footer>
      </div>
      <Footer />
    </div>
  );
};

export default Chat;
