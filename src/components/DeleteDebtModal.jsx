import { useState } from "react"
import api from "../services/api"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material"

export default function DeleteDebtModal({ open, onClose, debt, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [error, setError] = useState(null)

  async function handleDelete() {
    if (!debt) return
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/debts/${debt.id}`)
      setToastOpen(true)
      onDeleted()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Erro ao excluir dívida.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {debt && (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
          <DialogTitle>Excluir dívida</DialogTitle>
          <DialogContent>
            Tem certeza que deseja excluir a dívida <strong>{debt.title}</strong>?
            Esta ação não pode ser desfeita.
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Excluindo…" : "Excluir"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ zIndex: 1400 }}
      >
        <Alert severity="success" onClose={() => setToastOpen(false)}>
          Dívida removida com sucesso!
        </Alert>
      </Snackbar>
    </>
  )
}
