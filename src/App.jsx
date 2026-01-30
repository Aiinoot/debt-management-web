import { useState, useMemo } from "react"
import { ThemeProvider, CssBaseline, Box, IconButton, Tooltip } from "@mui/material"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import { getTheme } from "./theme"
import Dashboard from "./pages/Dashboard"

function App() {
  const [mode, setMode] = useState("dark")

  const theme = useMemo(() => getTheme(mode), [mode])

  const toggleMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const isDark = mode === "dark"
  const backgroundGradient = isDark
    ? "linear-gradient(180deg, #352550 0%, #2D1C42 40%, #251938 100%)"
    : "linear-gradient(180deg, #e8e0f0 0%, #f5f5f5 100%)"

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: backgroundGradient,
          pt: 1,
          pb: 3,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", pr: 2 }}>
          <Tooltip title={isDark ? "Modo claro" : "Modo escuro"}>
            <IconButton onClick={toggleMode} color="inherit" size="large">
              {isDark ? (
                <LightModeIcon sx={{ fontSize: 28 }} />
              ) : (
                <DarkModeIcon sx={{ fontSize: 28 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
        <Dashboard />
      </Box>
    </ThemeProvider>
  )
}

export default App
