import { useEffect, useState } from "react"
import api from "../services/api"
import ClientFormModal from "./ClientFormModal"
import EditClientModal from "./EditClientModal"
import DeleteClientModal from "./DeleteClientModal"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Tooltip,
    CircularProgress,
    Typography,
    Stack,
    Box,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

export default function ClientsTable({ onSelectClient }) {
    const [openModal, setOpenModal] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [clientToEdit, setClientToEdit] = useState(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [clientToDelete, setClientToDelete] = useState(null)
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

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Clientes</Typography>
                <Button variant="contained" onClick={() => setOpenModal(true)}>
                    + Novo cliente
                </Button>
            </Stack>
            <Table
                size="small"
                sx={{
                  "& .MuiTableCell-root": {
                    py: 1.5,
                    lineHeight: 1.6,
                  },
                }}
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Nome</TableCell>
                        <TableCell align="right">Ações</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {clients.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={2} align="center">
                                <Typography variant="body2" color="text.secondary">
                                    Nenhum cliente cadastrado ainda.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                    clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell>{client.full_name}</TableCell>

                            <TableCell align="right">
                                <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => onSelectClient(client)}
                                    >
                                        Dívidas
                                    </Button>
                                    <Tooltip title="Editar">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => {
                                                setClientToEdit(client)
                                                setEditModalOpen(true)
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Excluir">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => {
                                                setClientToDelete(client)
                                                setDeleteModalOpen(true)
                                            }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
            </Table>
            <ClientFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onCreated={fetchClients}
            />
            <EditClientModal
                open={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false)
                    setClientToEdit(null)
                }}
                client={clientToEdit}
                onUpdated={fetchClients}
            />
            <DeleteClientModal
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false)
                    setClientToDelete(null)
                }}
                client={clientToDelete}
                onDeleted={fetchClients}
            />
        </Box>
    )

}
