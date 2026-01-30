import { useEffect, useState } from "react"
import api from "../services/api"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Typography,
} from "@mui/material"

export default function DebtsTable({ client }) {
    const [debts, setDebts] = useState([])
    const [loading, setLoading] = useState(true)

    async function fetchDebts() {
        try {
            setLoading(true)

            const response = await api.get(`/debts?clientId=${client.id}`)
            setDebts(response.data)
        } catch (error) {
            console.error("Erro ao buscar dívidas:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDebts()
    }, [client])

    function getStatusChip(status) {
        if (status === "ABERTO") return <Chip label="Aberto" color="warning" />
        if (status === "QUITADO") return <Chip label="Quitado" color="success" />
        if (status === "DEVOLVIDO") return <Chip label="Devolvido" color="error" />

        return <Chip label={status} />
    }

    if (loading) {
        return <CircularProgress />
    }

    if (debts.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                Este cliente não possui dívidas cadastradas.
            </Typography>
        )
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Parcelas</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Status</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {debts.map((debt) => (
                    <TableRow key={debt.id}>
                        <TableCell>{debt.title}</TableCell>
                        <TableCell>{debt.installments}</TableCell>
                        <TableCell>R$ {debt.value}</TableCell>
                        <TableCell>{getStatusChip(debt.status)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
