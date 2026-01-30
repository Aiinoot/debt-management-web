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
} from "@mui/material"

export default function EditClientModal({ open, onClose, client, onUpdated }) {
  const [formData, setFormData] = useState({
    full_name: "", cpf: "", email: "", phone: "",
    cep: "", street: "", number: "", neighborhood: "", city: "", uf: "",
  })
  const [errors, setErrors] = useState({})
  const [toastOpen, setToastOpen] = useState(false)

  useEffect(() => {
    if (client) {
      setFormData({
        full_name: client.full_name ?? "",
        cpf: client.cpf ?? "",
        email: client.email ?? "",
        phone: client.phone ?? "",
        cep: client.cep ?? "",
        street: client.street ?? "",
        number: client.number ?? "",
        neighborhood: client.neighborhood ?? "",
        city: client.city ?? "",
        uf: client.uf ?? "",
      })
    }
  }, [client])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function checkCEP(e) {
    const cep = e.target.value.replace(/\D/g, "")
    setFormData((prev) => ({ ...prev, cep }))
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro ?? prev.street,
            neighborhood: data.bairro ?? prev.neighborhood,
            city: data.localidade ?? prev.city,
            uf: data.uf ?? prev.uf,
          }))
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err)
      }
    }
  }

  function validate() {
    let newErrors = {}
    if (!formData.full_name?.trim()) newErrors.full_name = "Obrigatório"
    if (!formData.cpf?.trim()) newErrors.cpf = "Obrigatório"
    if (!formData.cep?.trim()) newErrors.cep = "Obrigatório"
    if (!formData.city?.trim()) newErrors.city = "Obrigatório"
    if (!formData.street?.trim()) newErrors.street = "Obrigatório"
    if (!formData.uf?.trim()) newErrors.uf = "Obrigatório"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    try {
      await api.put(`/clients/${client.id}`, formData)
      setToastOpen(true)
      setErrors({})
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
      {client && (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Editar Cliente</DialogTitle>

        <DialogContent sx={{ minWidth: 320 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nome Completo"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                error={!!errors.full_name}
                helperText={errors.full_name}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                error={!!errors.cpf}
                helperText={errors.cpf}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="CEP"
                name="cep"
                value={formData.cep}
                onChange={checkCEP}
                error={!!errors.cep}
                helperText={errors.cep}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                label="Rua"
                name="street"
                value={formData.street}
                onChange={handleChange}
                error={!!errors.street}
                helperText={errors.street}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Nº"
                name="number"
                value={formData.number}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Bairro"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="UF"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                error={!!errors.uf}
                helperText={errors.uf}
                fullWidth
              />
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
          Cliente atualizado com sucesso!
        </Alert>
      </Snackbar>
    </>
  )
}
