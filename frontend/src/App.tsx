import { CssBaseline, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Mapping } from "./components/mapping";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
      <CssBaseline />
      <Mapping />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
