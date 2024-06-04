import { CurrentUserContext } from "App";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiDomain } from "scripts/apiDomain";
import { useSocketContext } from "contexts/socketContext";

export default function SuggestionCard({
  avatar,
  username,
  userID,
  following,
}) {
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);
  const [followed, setFollowed] = useState(following);
  const { socket } = useSocketContext();

  function navigateToSearchedPerson() {
    return navigate(`/profile?username=${username}`, {
      state: { userID: userID },
    });
  }

  function follow() {
    fetch(apiDomain() + "/updateUserConnections", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, status: "followed" }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.message === "success") {
          setFollowed(true);
        }
      })
      .then(
        socket.emit("notify", {
          sender: currentUser.id,
          target: username,
          notificationType: "follow",
        })
      )
      .catch((err) => console.error(err));
  }

  function unfollow() {
    fetch(apiDomain() + "/updateUserConnections", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentUser.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, status: "unfollowed" }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.message === "success") {
          setFollowed(false);
        }
      })
      .catch((err) => console.error(err));
  }

  return (
    <div
      id="suggestionCard"
      className="card rounded-4 d-flex flex-column"
      style={{
        border: "1px solid var(--main-purple)",
        maxWidth: "10rem",
        maxHeight: "20rem",
        background: "transparent",
      }}
    >
      <div onClick={navigateToSearchedPerson}>
        {/* AVATAR OF PERSON */}
        <div className="mb-3 rounded-circle" style={{ padding: ".5rem" }}>
          <img
            src={avatar}
            alt={`${username}'s Avatar`}
            className="rounded-circle"
            style={{
              backgroundImage: currentUser?.avatar,
              height: "8rem",
              width: "8rem",
              objectFit: "cover",
            }}
          />
        </div>

        {/* PERSON'S USERNAME */}
        <div className="d-flex align-items-center justify-content-center mb-3">
          <span style={{ fontSize: "1.2rem", color: "var(--main-purple)" }}>
            {username}
          </span>
        </div>
      </div>

      {/* BUTTON TO CONNECT */}
      {followed ? (
        <button
          onClick={unfollow}
          className="isConnected-btn w-100 rounded-4 p-3"
        >
          Connected
        </button>
      ) : (
        <button
          onClick={follow}
          className="isNotConnected-btn w-100 rounded-4 p-3"
        >
          Connect
        </button>
      )}
    </div>
  );
}
