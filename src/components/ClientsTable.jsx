import { useEffect, useState } from "react"
import api from "../services/api"
import ClientFormModal from "./ClientFormModal"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    CircularProgress,
    Typography,
    Stack,
    Box,
} from "@mui/material"

export default function ClientsTable({ onSelectClient }) {
    const [openModal, setOpenModal] = useState(false)
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)

    async function fetchClients() {
        try {
            const response = await api.get("/clients")
            setClients(response.data)
        } catch (error) {
            console.error("Erro ao buscar clientes:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    if (loading) {
        return <CircularProgress />
    }

    if (clients.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                Nenhum cliente cadastrado ainda.
            </Typography>
        )
    }

    return (
        <Box>
            <Stack direction="row" justifyContent="flex-end" mb={2}>
                <Button variant="contained" onClick={() => setOpenModal(true)}>
                    + Novo Cliente
                </Button>
            </Stack>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell>{client.full_name}</TableCell>

                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => onSelectClient(client)}
                                >
                                    Ver Dívidas
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ClientFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onCreated={fetchClients}
            />
        </Box>
    )

}
