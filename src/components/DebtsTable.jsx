import { useEffect, useState } from "react"
import api from "../services/api"
import DebtFormModal from "./DebtFormModal"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material"

export default function DebtsTable({ client }) {
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)

  async function fetchDebts() {
    if (!client?.id) return
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
    if (client?.id) {
      fetchDebts()
    } else {
      setDebts([])
    }
  }, [client?.id])

  function getStatusChip(status) {
    if (status === "ABERTO") return <Chip label="Aberto" color="warning" size="small" />
    if (status === "QUITADO") return <Chip label="Quitado" color="success" size="small" />
    if (status === "DEVOLVIDO") return <Chip label="Devolvido" color="error" size="small" />
    return <Chip label={status || ""} size="small" />
  }

  function formatDate(dateStr) {
    if (!dateStr) return "-"
    const d = new Date(dateStr)
    return d.toLocaleDateString("pt-BR")
  }

  if (!client) {
    return (
      <Typography variant="body2" color="text.secondary">
        Selecione um cliente para visualizar as dívidas.
      </Typography>
    )
  }

  if (loading) {
    return <CircularProgress />
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setFormModalOpen(true)}>
          + Nova Dívida
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell align="center">Parcelas</TableCell>
            <TableCell align="right">Valor</TableCell>
            <TableCell>Vencimento</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {debts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body2" color="text.secondary">
                  Este cliente não possui dívidas cadastradas.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            debts.map((debt) => (
              <TableRow key={debt.id}>
                <TableCell>{debt.title}</TableCell>
                <TableCell align="center">{debt.installments}</TableCell>
                <TableCell align="right">
                  R$ {Number(debt.value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>{formatDate(debt.due_date)}</TableCell>
                <TableCell>{getStatusChip(debt.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DebtFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        client={client}
        onCreated={fetchDebts}
      />
    </Box>
  )
}
