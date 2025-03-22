import { Backdrop } from "@mui/material";
import { useEffect } from "react";
import "../css/Loading.css";

function Loading({ loading }) {
  // Disable scroll when loading is true
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup on unmount or when loading changes
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [loading]);

  return (
    <Backdrop
      open={loading}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <span class="loader"></span>
    </Backdrop>

  );
}

export default Loading;