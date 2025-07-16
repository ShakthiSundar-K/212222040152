import axios from "axios";

const logger = async (stack, level, pkg, message) => {
  try {
    await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.error("Frontend Logging Failed:", err.message);
  }
};

export default logger;
