import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Save as SaveIcon, ArrowBack as ArrowBackIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { createPatient } from "../../api/patients";

const territories = ["Firdavsi", "Somoni", "Shohmansur", "Sino"];
const diseases = ["Flu", "Cold", "Fever", "Hepatitis", "ARVI", "Tuberculosis", "Diabetes", "Others"];

export default function NewPatientPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    hospitalRegistrationNumber: "",
    name: "",
    recordDate: "",
    territoryName: "Firdavsi",
    disease: "Flu",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createPatient(form);
      setSuccess(true);
      setTimeout(() => navigate("/patients"), 1500);
    } catch (err) {
      console.error(err);
      setError("Не удалось создать пациента. Проверьте подключение к серверу.");
    } finally {
      setLoading(false);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 4, background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)" }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4, p: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: 3, boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <PersonAddIcon sx={{ fontSize: 40, color: "white" }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: "white" }}>
              Добавить пациента
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>
            Заполните форму для регистрации нового пациента
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>Пациент успешно создан! Перенаправление...</Alert>}

        {/* Form Card */}
        <Card sx={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)", borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)", mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField label="Регистрационный номер больницы" value={form.hospitalRegistrationNumber} onChange={(e) => setForm({ ...form, hospitalRegistrationNumber: e.target.value })} required disabled={loading} fullWidth sx={textFieldSx} />
                <TextField label="Имя пациента" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required disabled={loading} fullWidth sx={textFieldSx} />
                <TextField label="Дата записи" type="date" value={form.recordDate} onChange={(e) => setForm({ ...form, recordDate: e.target.value })} required disabled={loading} fullWidth InputLabelProps={{ shrink: true }} sx={textFieldSx} />
                <TextField select label="Территория" value={form.territoryName} onChange={(e) => setForm({ ...form, territoryName: e.target.value })} disabled={loading} fullWidth sx={textFieldSx}>
                  {territories.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
                <TextField select label="Болезнь" value={form.disease} onChange={(e) => setForm({ ...form, disease: e.target.value })} disabled={loading} fullWidth sx={textFieldSx}>
                  {diseases.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </TextField>

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} disabled={loading} sx={{ flex: 1, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", py: 1.5, fontSize: "1rem", fontWeight: 600, boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)", "&:hover": { boxShadow: "0 6px 30px rgba(102, 126, 234, 0.6)" } }}>
                    {loading ? "Сохранение..." : "Добавить"}
                  </Button>
                  <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/patients")} disabled={loading} sx={{ borderColor: "rgba(255, 255, 255, 0.3)", color: "white", "&:hover": { borderColor: "rgba(255, 255, 255, 0.5)", background: "rgba(255, 255, 255, 0.05)" } }}>
                    Отмена
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}