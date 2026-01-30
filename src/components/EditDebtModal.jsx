import { useState, useEffect } from "react"
import api from "../services/api"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material"

const STATUS_OPTIONS = [
  { value: "ABERTO", label: "Aberto" },
  { value: "QUITADO", label: "Quitado" },
  { value: "DEVOLVIDO", label: "Devolvido" },
]

export default function EditDebtModal({ open, onClose, debt, onUpdated }) {
  const [formData, setFormData] = useState({
    title: "",
    installments: "",
    value: "",
    due_date: "",
    status: "ABERTO",
  })
  const [errors, setErrors] = useState({})
  const [toastOpen, setToastOpen] = useState(false)

  useEffect(() => {
    if (debt) {
      const dueDate = debt.due_date
        ? new Date(debt.due_date).toISOString().slice(0, 10)
        : ""
      setFormData({
        title: debt.title ?? "",
        installments: debt.installments ?? "",
        value: debt.value ?? "",
        due_date: dueDate,
        status: debt.status ?? "ABERTO",
      })
    }
  }, [debt])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    const newErrors = {}
    if (!formData.title?.trim()) newErrors.title = "Obrigatório"
    if (formData.installments === "" || formData.installments === null)
      newErrors.installments = "Obrigatório"
    else if (Number(formData.installments) < 1)
      newErrors.installments = "Deve ser pelo menos 1"
    if (formData.value === "" || formData.value === null)
      newErrors.value = "Obrigatório"
    else if (Number(formData.value) <= 0) newErrors.value = "Deve ser maior que 0"
    if (!formData.due_date?.trim()) newErrors.due_date = "Obrigatório"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate() || !debt) return
    const payload = {
      client_id: debt.client_id,
      title: formData.title.trim(),
      installments: Number(formData.installments),
      value: Number(formData.value),
      due_date: formData.due_date,
      status: formData.status,
    }
    try {
      await api.put(`/debts/${debt.id}`, payload)
      setToastOpen(true)
      onUpdated()
      onClose()
    } catch (err) {
      if (err.response?.data?.errors) {
        const apiErrors = {}
        err.response.data.errors.forEach((e) => {
          apiErrors[e.field] = e.message
        })
        setErrors(apiErrors)
      } else {
        console.error(err)
      }
    }
  }

  return (
    <>
      {debt && (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
          <DialogTitle>Editar Dívida</DialogTitle>
          <DialogContent sx={{ minWidth: 280 }}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Título / Descrição"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Parcelas"
                  name="installments"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={formData.installments}
                  onChange={handleChange}
                  error={!!errors.installments}
                  helperText={errors.installments}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Valor (R$)"
                  name="value"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                  value={formData.value}
                  onChange={handleChange}
                  error={!!errors.value}
                  helperText={errors.value}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data de Vencimento"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                  error={!!errors.due_date}
                  helperText={errors.due_date}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Salvar Alterações
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
          Dívida atualizada com sucesso!
        </Alert>
      </Snackbar>
    </>
  )
}
