import { useState } from "react"
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
    Box,
    Grid
} from "@mui/material"

// Máscaras de exibição
function maskCPF(v) {
    const d = (v || "").replace(/\D/g, "").slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function maskCEP(v) {
    const d = (v || "").replace(/\D/g, "").slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function maskPhone(v) {
    const d = (v || "").replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Remove máscara (apenas dígitos)
function unmask(value) {
    return (value || "").replace(/\D/g, "");
}

export default function ClientFormModal({ open, onClose, onCreated }) {
    const [formData, setFormData] = useState({
        full_name: "",
        cpf: "",
        email: "",
        phone: "",
        cep: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        uf: ""
    })

    const checkCEP = async (e) => {
        const raw = unmask(e.target.value);
        const cep = maskCEP(raw);
        setFormData(prev => ({ ...prev, cep }));
        if (raw.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
                const data = await response.json();

                if (data.erro) {
                    setErrors(prev => ({ ...prev, cep: "CEP inválido" }))
                } else {
                    setFormData(prev => ({
                        ...prev,
                        street: data.logradouro,
                        neighborhood: data.bairro,
                        city: data.localidade,
                        uf: data.uf
                    }));
                }
            } catch (err) {
                console.error("Erro ao buscar CEP", err);
            }
        }
    };

    const [errors, setErrors] = useState({})
    const [toastOpen, setToastOpen] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "cpf") {
            setFormData(prev => ({ ...prev, cpf: maskCPF(value) }));
            return;
        }
        if (name === "phone") {
            setFormData(prev => ({ ...prev, phone: maskPhone(value) }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function validate() {
        let newErrors = {}
        if (!formData.full_name.trim()) newErrors.full_name = "Obrigatório"
        if (!unmask(formData.cpf).trim()) newErrors.cpf = "Obrigatório"
        if (!unmask(formData.cep).trim()) newErrors.cep = "Obrigatório"
        if (!formData.city.trim()) newErrors.city = "Obrigatório"
        if (!formData.street.trim()) newErrors.street = "Obrigatório"
        if (!formData.uf.trim()) newErrors.uf = "Obrigatório"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit() {
        if (!validate()) return

        const payload = {
            ...formData,
            cpf: unmask(formData.cpf),
            phone: unmask(formData.phone),
            cep: unmask(formData.cep)
        }

        try {
            await api.post("/clients", payload)
            setToastOpen(true)
            setFormData({
                full_name: "", cpf: "", email: "", phone: "",
                cep: "", street: "", number: "", neighborhood: "",
                city: "", uf: ""
            })
            setErrors({})
            onCreated()
            onClose()
        } catch (err) {
            if (err.response?.data?.errors) {
                const apiErrors = {}
                err.response.data.errors.forEach(e => { apiErrors[e.field] = e.message })
                setErrors(apiErrors)
            } else {
                console.error(err)
            }
        }
    }

    return (
        <Box>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
                <DialogTitle>Novo Cliente</DialogTitle>
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
                            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Telefone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
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
                            <TextField label="Rua" name="street" value={formData.street} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <TextField label="Nº" name="number" value={formData.number} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField label="Bairro" name="neighborhood" value={formData.neighborhood} onChange={handleChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField label="Cidade" name="city" value={formData.city} onChange={handleChange} error={!!errors.city} helperText={errors.city} fullWidth />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                            <TextField label="UF" name="uf" value={formData.uf} onChange={handleChange} error={!!errors.uf} helperText={errors.uf} fullWidth />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button variant="contained" onClick={handleSubmit}>Salvar</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={toastOpen} autoHideDuration={3000} onClose={() => setToastOpen(false)}>
                <Alert severity="success">Cliente cadastrado com sucesso!</Alert>
            </Snackbar>
        </Box>
    )
}