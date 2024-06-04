import React from "react";
import PropTypes from "prop-types";

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "16px",
    maxWidth: "300px",
    textAlign: "center",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
  },
  name: {
    fontSize: "1.5em",
    margin: "0.5em 0",
  },
  price: {
    fontSize: "1.2em",
    color: "#007BFF",
  },
  description: {
    fontSize: "1em",
    color: "#555",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string,
};

ProductCard.defaultProps = {
  description: "No description available.",
};

export default function ProductCard({ image, name, price, description }) {
  const handleBuyNow = () => {
    console.log(`Product: ${name}, Price: $${price}`);
  };

  return (
    <div style={styles.card}>
      <img src={image} alt={name} style={styles.image} />
      <h2 style={styles.name}>{name}</h2>
      <p style={styles.price}>${price}</p>
      <p style={styles.description}>{description}</p>
      <button onClick={handleBuyNow} style={styles.button}>
        Buy Now
      </button>
    </div>
  );
}
