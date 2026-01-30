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

export default function DeleteClientModal({ open, onClose, client, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)
  const [error, setError] = useState(null)

  async function handleDelete() {
    if (!client) return
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/clients/${client.id}`)
      setToastOpen(true)
      onDeleted()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Erro ao excluir cliente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {client && (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
          <DialogTitle>Excluir cliente</DialogTitle>
          <DialogContent>
            Tem certeza que deseja excluir o cliente <strong>{client.full_name}</strong>?
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
          Cliente removido com sucesso!
        </Alert>
      </Snackbar>
    </>
  )
}
