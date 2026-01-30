import { useState } from "react"
import { Box, Paper, Typography } from "@mui/material"

import ClientsTable from "../components/ClientsTable"
import DebtsTable from "../components/DebtsTable"

const paperSx = {
  p: "25px",
  borderRadius: "25px",
  boxShadow: 6,
}

export default function Dashboard() {
  const [selectedClient, setSelectedClient] = useState(null)

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
        gap: 3,
        mt: 2,
        px: 2,
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      <Paper sx={paperSx}>
        <ClientsTable onSelectClient={setSelectedClient} />
      </Paper>

      <Paper sx={paperSx}>
        {selectedClient ? (
          <DebtsTable client={selectedClient} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            Selecione um cliente para visualizar as dívidas.
          </Typography>
        )}
      </Paper>
    </Box>
  )
}
