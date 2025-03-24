import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import * as TwilioVideo from "twilio-video";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdCallEnd } from "react-icons/md";

const Call = () => {
  const [searchParams] = useSearchParams();
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { authToken } = useContext(AuthContext);
  const [twilioRoom, setTwilioRoom] = useState(null);
  const [localTrack, setLocalTrack] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoContainerRef = useRef(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  useEffect(() => {
    const roomNameParam = searchParams.get("roomName");
    if (roomNameParam) {
      setRoomName(roomNameParam);
    }
  }, [searchParams]);

  // Auto joins room if a room name is present
  useEffect(() => {
    if (roomName) {
      joinRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomName]);

  //Creates and attaches local video, runs once on mount
  useEffect(() => {
    const createAndAttachLocalVideo = async () => {
      try {
        console.log("Creating local video track on mount");
        const videoTrack = await TwilioVideo.createLocalVideoTrack();
        setLocalTrack(videoTrack);

        if (localVideoRef.current) {
          console.log("Attaching track to localVideoRef on mount", videoTrack);
          videoTrack.attach(localVideoRef.current);
        }
      } catch (error) {
        console.error("Error creating local video track:", error);
        setMessage("Error accessing camera. Please check permissions.");
      }
    };

    createAndAttachLocalVideo();

    return () => {
      if (localTrack) {
        console.log("Cleaning up localTrack on unmount");
        localTrack.detach().forEach((element) => element.remove());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array means run only once on mount

  //Attach local video on track and ref changes, handles ref change
  useEffect(() => {
    if (localTrack && localVideoRef.current) {
      console.log(
        "Attaching track to localVideoRef:",
        localTrack,
        localVideoRef.current
      );
      localTrack.attach(localVideoRef.current);
    }
    return () => {
      if (localTrack && localVideoRef.current) {
        console.log("Detaching track from localVideoRef", localTrack);
        localTrack
          .detach(localVideoRef.current)
          .forEach((element) => element.remove());
      }
    };
  }, [localTrack, localVideoRef.current]);

  const handleAudioToggle = () => {
    if (localTrack) {
      setIsAudioEnabled(!isAudioEnabled);
      localTrack.mediaStreamTrack.enabled = !isAudioEnabled;
    }
  };
  const handleVideoToggle = () => {
    if (localTrack) {
      setIsVideoEnabled(!isVideoEnabled);
      localTrack.mediaStreamTrack.enabled = !isVideoEnabled;
    }
  };

  const connectToRoom = async (token) => {
    console.log("Connecting to room with token:", token);
    setLoading(true);
    setMessage("");

    try {
      const room = await TwilioVideo.connect(token, {
        name: roomName,
        audio: isAudioEnabled,
        video: isVideoEnabled,
      });
      setTwilioRoom(room);
      console.log("Connected to Twilio Room:", room);

      //Publish existing local track
      if (localTrack) {
        console.log("Publishing local track", localTrack);
        room.localParticipant.publishTrack(localTrack);
      }

      //Attach remote participants
      room.participants.forEach(handleParticipant);
      room.on("participantConnected", handleParticipant);
      room.on("participantDisconnected", removeParticipantTracks);
    } catch (error) {
      console.error("Error connecting to Twilio room:", error);
      setMessage(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleParticipant = (participant) => {
    console.log("Participant Connected:", participant);

    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed) {
        handleTrackSubscribed(publication.track, participant);
      }
    });

    participant.on("trackSubscribed", (track) =>
      handleTrackSubscribed(track, participant)
    );
    participant.on("trackUnsubscribed", handleTrackUnsubscribed);
  };

  const handleTrackSubscribed = (track, participant) => {
    if (track.kind === "video") {
      let existingVideo = remoteVideoContainerRef.current.querySelector(
        `[data-participant="${participant.sid}"]`
      );
      if (!existingVideo) {
        const videoElement = document.createElement("video");
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.setAttribute("data-participant", participant.sid);
        videoElement.style.width = "100%";
        videoElement.style.height = "100vh";
        videoElement.style.objectFit = "cover";

        track.attach(videoElement);
        remoteVideoContainerRef.current.appendChild(videoElement);
      }
    } else if (track.kind === "audio") {
      let existingAudio = document.querySelector(
        `audio[data-participant="${participant.sid}"]`
      );
      if (!existingAudio) {
        const audioElement = document.createElement("audio");
        audioElement.autoplay = true;
        audioElement.setAttribute("data-participant", participant.sid);
        track.attach(audioElement);
        document.body.appendChild(audioElement);
      }
    }
  };

  const handleTrackUnsubscribed = (track) => {
    track.detach().forEach((element) => element.remove());
  };

  const removeParticipantTracks = (participant) => {
    document
      .querySelectorAll(`[data-participant="${participant.sid}"]`)
      .forEach((element) => element.remove());
  };

  const disconnectFromRoom = () => {
    if (twilioRoom) {
      console.log("Disconnecting from room");
      // Turn off audio/video before disconnecting
      if (localTrack) {
        localTrack.mediaStreamTrack.enabled = false;
      }
      twilioRoom.disconnect();
      setTwilioRoom(null);
      navigate("/home");
    }
  };

  const joinRoom = async () => {
    console.log("Joining Room with name:", roomName);
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${api}/join-room`,
        { roomName },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { token } = response.data;
      await connectToRoom(token);
    } catch (error) {
      console.error("Error Joining Room:", error);
      setMessage(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen bg-gray-100 overflow-hidden">
      <div
        ref={remoteVideoContainerRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      ></div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center space-x-4">
        <button
          onClick={disconnectFromRoom}
          className="text-white bg-red-500 rounded-full p-2 hover:bg-red-600"
        >
          <MdCallEnd size={24} className="text-red" />
        </button>
        {/* <div className="flex items-center space-x-4">
          <button
            onClick={handleAudioToggle}
            className={`rounded-full p-2 hover:bg-gray-200 ${
              isAudioEnabled ? "text-gray-600" : "text-red-500"
            }`}
          >
            {isAudioEnabled ? (
              <FaMicrophone size={20} />
            ) : (
              <FaMicrophoneSlash size={20} />
            )}
          </button>
          <button
            onClick={handleVideoToggle}
            className={`rounded-full p-2 hover:bg-gray-200 ${
              isVideoEnabled ? "text-gray-600" : "text-red-500"
            }`}
          >
            {isVideoEnabled ? (
              <FaVideo size={20} />
            ) : (
              <FaVideoSlash size={20} />
            )}
          </button>
        </div> */}
      </div>
      <div
        className="absolute bottom-4 right-4 z-10"
        style={{ width: "300px" }}
      >
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          className="border rounded w-full aspect-video"
        />
      </div>
      {message && (
        <div className="absolute top-4 left-4 text-red-600 z-20">{message}</div>
      )}
    </div>
  );
};

export default Call;
