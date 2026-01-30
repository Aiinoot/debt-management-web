import { createTheme } from "@mui/material/styles"

/**
 * Tema "Violet Night" — paleta roxa elegante.
 * Dark mode ativo por padrão com fundo em degradê leve (aplicado no layout).
 */
export function getTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#7A5498",
      },
      secondary: {
        main: "#4D2F70",
      },
      background: {
        default: mode === "dark" ? "#2D1C42" : "#f5f5f5",
        paper: mode === "dark" ? "#2b2139" : "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
    },
  })
}
