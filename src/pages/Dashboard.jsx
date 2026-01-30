import { useState } from "react"
import { Grid, Paper, Typography } from "@mui/material"

import ClientsTable from "../components/ClientsTable"
import DebtsTable from "../components/DebtsTable"

export default function Dashboard() {
    const [selectedClient, setSelectedClient] = useState(null)

    return (
        <Grid container spacing={2} padding={2}>
            <Grid item xs={12} md={5}>
                <Paper sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Clientes
                    </Typography>

                    <ClientsTable onSelectClient={setSelectedClient} />
                </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
                <Paper sx={{ padding: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {selectedClient
                            ? `Dívidas de ${selectedClient.full_name}`
                            : "Dívidas do Cliente"}
                    </Typography>


                    {selectedClient ? (
                        <DebtsTable client={selectedClient} />
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Selecione um cliente para visualizar as dívidas.
                        </Typography>
                    )}
                </Paper>
            </Grid>
        </Grid>
    )
}