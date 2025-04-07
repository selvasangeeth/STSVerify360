import React, { useState, useEffect } from "react";
const quotes = [
  "Testing leads to failure, and failure leads to understanding. - Burt Rutan",
  "Software testing is a sport like running. Each time you find a bug, it’s a victory. - Anonymous",
  "Quality is never an accident. It is always the result of intelligent effort. - John Ruskin",
  "A good tester is one who knows how to break software in a constructive way. - Anonymous",
  "If you don’t like testing your product, most likely your customers won’t like to test it either. - Anonymous",
];
const QuoteDisplay = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 10000); // Change quote every 10 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  return (
    <div style={styles.container}>
      <h2 style={styles.staticText}>Select a Project</h2> {/* Static Text */}
      <p style={styles.quote}>{quotes[quoteIndex]}</p> {/* Dynamic Quote */}
    </div>
  );
};
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    fontSize: "18px",
    color: "#333",
    textAlign: "center",
    padding: "20px",
  },
  staticText: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  quote: {
    fontStyle: "italic",
    maxWidth: "70%",
  },
};
export default QuoteDisplay;