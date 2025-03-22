import { Backdrop } from "@mui/material";
import "../css/Loading.css";

function Loading(loading) {
    return(
        <Backdrop
          open={loading}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <span class="loader"></span>
        </Backdrop>

    );
}

export default Loading;