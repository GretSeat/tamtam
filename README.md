# TamTam Assessment

## Component Explanation

The `SuggestionCard` component is something I made that will show the current user a "suggested user" that they might want to "connect with" (essentially becoming friends with). It includes a User Avatar (their photo), the User Name (The user's name they chose), and a button that let's you click to "Connect" with the user, or if you are already connected it will display "Connected".

### Props

- `avatar (string)`: The URL of the suggested user's avatar, or the place in the database the avatar is being held.
- `username (string)`: The suggested user's username they chose on a previous sign up screen.
- `userID (string)`: The unique ID of the suggested user (basically just a number assigned to them when they signed up).
- `following (boolean)`: Indicates whether the current user is following the suggested user.

### State Management

The component uses the `useState` hook to manage the `followed` state, which tracks whether the current user is following the suggested user.

### Design Decisions

- The component leverages the `useContext` hook to access the `currentUser` context and the `useSocketContext` to handle real-time notifications.
- `useNavigate` from `react-router-dom` is used for navigating to the suggested user's profile.
- The component uses Bootstrap for easy and reliable inline styling.

### Challenges and Solutions

1. **Handling Async Operations:** Ensuring the follow/unfollow operations update the state and notify the server appropriately. This was addressed using `fetch` for HTTP requests and `socket.emit` using socket.io for real-time notifications. The challenge here was having the users being able to properly follow each other by sending logic back to the database, after some trial and error it seemed like an easy fix by that wasn't in the component itself but the backend code.
2. **Error Handling:** Properly handling potential errors during the follow/unfollow operations by logging them to the console. The challenge was that sometimes clicking "Connect" wouldn't properly switch the display to "Connected", so I would go back to the button, and add console logs to see what the problem was, before realizing it was my turnary.
3. **Styling with Bootstrap:** Basically if you've used Bootstrap before you know that it can be a blessing and a curse, the thing I struggled with when designing this was being able to customize my component. Bootstrap has a lot of great solutions, but nothing beats having custom CSS for your component. So essentially the solution I had to use was flipping back and forth between the two files (styles and jsx) to make sure my component looked exactly the way I wanted it to.

### Code Snippets and Explanations

#### Button To Connect

```javascript
{
  followed ? ( // This is a conditional seeing if the current user is currently following the Suggested User.
    <button onClick={unfollow} className="isConnected-btn w-100 rounded-4 p-3">
      Connected
    </button> // If the current user IS following the suggested user the button that will be displayed is "Connected", and when clicking on that button will run the "Unfollow" function, essentially deleting that user from the database as a "connection".
  ) : (
    <button onClick={follow} className="isNotConnected-btn w-100 rounded-4 p-3">
      Connect
    </button> // If the current user is NOT following the suggested user the button will be displayed as "Connect", and when clicking on that button will run the "Follow" function, essentially adding the logic that the two users are now "connected" on the application by updating the database to "following === true"
  );
}
```

#### Follow Function

```javascript
function follow() {
  fetch(apiDomain() + "/updateUserConnections", {
    // The fetch request will grab the "apiDomain" which is inside of my "scripts" folder, and inside a file called "apiDomain" which is just holding the API's domain to access depending on if I'm coding on the development or production environment
    method: "POST",
    headers: {
      Authorization: `Bearer ${currentUser.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, status: "followed" }),
  })
    .then((r) => r.json()) // takes the response and converts it to json.
    .then((r) => {
      if (r.message === "success") {
        setFollowed(true); // if the response message is "Success" then the state for setFollowed gets updated to true
      }
    })
    .then(
      socket.emit("notify", {
        sender: currentUser.id,
        target: username,
        notificationType: "follow",
      }) // This emits a signal to socket to deliver a notification to other components to show real time notifications in other parts of the application.
    )
    .catch((err) => console.error(err)); // catching the error if there is one.
}
```

# Component Implementation

1. Create a new React component called "ProductCard" that displays a product's image, name, price, and a brief description.

The component should accept the following props:

- image (string): The URL of the product image.
- name (string): The name of the product.
- price (number): The price of the product.
- description (string): A brief description of the product.

2. Implement the component's structure using JSX and apply basic styling using CSS or a styling library of your choice.

3. Create a "Buy Now" button within the component. When clicked, it should log the product's name and price to the console.

4. Write a brief explanation of your component's implementation, including your choice of styling approach and any additional features you added.

Styling Choice for this was something different for me, I have always used Bootstrap for the majority of my styling, but this time around I decided to spread my wings and expand my knowledge and use a styles object. The benefit of using this is you get your custom styles all on the same page for a smaller component, so you can make changes without having to remember any type of shorthand, the downside being that if your component has a lot of styles, or has a lot of code it can get overwhelming, and while I see the benefit of this type of styling, I think I will stick to using a separate style sheet with classNames and IDs.

## Error Handling and Edge Cases

1. Explain how you would handle scenarios where the required props are not provided or have incorrect data types.

PropTypes is a React library that you could use that basically makes it so it's almost impossible for proptypes to be missing. And if those props are not the correct ones React will display an error message in the console, but the whole thing of code will still render properly.

2. Discuss any potential edge cases that could arise while using the "ProductCard" component and how you would address them.

- The first thing that comes to mind that could arise while using this component is what happens if the numbers go negative or too large which would break the code. I have gotten into the habit of truncating long sentences, and if the case arose with numbers I assume it would be the same.

- To make sure the numbers stay as positive I would have to impliment restrictions in the proptypes stating it's to be a number.

3. Provide code snippets to demonstrate your error handling and edge case management approach.

```javascript
ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};

ProductCard.defaultProps = {
  image: "https://via.placeholder.com/150", // Default image URL
  description: "No description available", // Default description
};

export default function ProductCard({ image, name, price, description }) {
  const handleImageError = (e) => {
    e.target.src = "INSERT YOUR URL TO A COOL IMAGE";
  }; // This is what will always be a "default" if something goes wrong.

  const validPrice =
    typeof price === "number" && price > 0
      ? price
      : "INSERT YOUR OWN ERROR DISPLAY HERE FOR THE INCORRECT PRICE TYPE"; // This will show up when the price that is supposed to be here turns out to not be a number.

  {
    /* Each of these areas below have "defaults" that if each prop shows up as false the "defaults" will show up instead.  By doing so we can figure out what area is not showing up properly. */
  }
  return (
    <div className="product-card">
      <img src={image} alt={name} onError={handleImageError} />
      <h2>{name || "Unnamed Product"}</h2>
      <p>{description || "No description available"}</p>
      <p>{validPrice !== "N/A" ? `$${validPrice}` : "Price not available"}</p>
      <button
        onClick={() =>
          console.log(`Buying ${name || "Unnamed Product"} for $${validPrice}`)
        }
      >
        Buy Now
      </button>
    </div>
  );
}
```
