import { useEffect, useState } from "react"
import api from "../services/api"
import DebtFormModal from "./DebtFormModal"
import EditDebtModal from "./EditDebtModal"
import DeleteDebtModal from "./DeleteDebtModal"

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
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

export default function DebtsTable({ client }) {
  const [debts, setDebts] = useState([])
  const [loading, setLoading] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [debtToEdit, setDebtToEdit] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [debtToDelete, setDebtToDelete] = useState(null)
  const [statusToastOpen, setStatusToastOpen] = useState(false)

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

  async function updateStatus(debt, newStatus) {
    if (!debt?.id) return
    try {
      await api.put(`/debts/${debt.id}`, {
        client_id: debt.client_id,
        title: debt.title,
        installments: Number(debt.installments),
        value: Number(debt.value),
        due_date: typeof debt.due_date === "string" && debt.due_date.length >= 10
          ? debt.due_date.slice(0, 10)
          : new Date(debt.due_date).toISOString().slice(0, 10),
        status: newStatus,
      })
      setStatusToastOpen(true)
      fetchDebts()
    } catch (err) {
      console.error(err)
    }
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
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {debts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
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
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end">
                    {debt.status !== "QUITADO" && (
                      <Tooltip title="Marcar como Quitado">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => updateStatus(debt, "QUITADO")}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setDebtToEdit(debt)
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
                          setDebtToDelete(debt)
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

      <DebtFormModal
        open={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        client={client}
        onCreated={fetchDebts}
      />
      <EditDebtModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setDebtToEdit(null)
        }}
        debt={debtToEdit}
        onUpdated={fetchDebts}
      />
      <DeleteDebtModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setDebtToDelete(null)
        }}
        debt={debtToDelete}
        onDeleted={fetchDebts}
      />

      <Snackbar
        open={statusToastOpen}
        autoHideDuration={3000}
        onClose={() => setStatusToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ zIndex: 1400 }}
      >
        <Alert severity="success" onClose={() => setStatusToastOpen(false)}>
          Marcado como quitado!
        </Alert>
      </Snackbar>
    </Box>
  )
}
