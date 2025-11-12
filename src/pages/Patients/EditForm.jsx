import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { getPatientById, updatePatient } from "../../api/patients";
import '../../App.css'
const territories = ["Firdavsi", "Somoni", "Shohmansur", "Sino"];
const diseases = [
  "Flu",
  "Cold",
  "Fever",
  "Hepatitis",
  "ARVI",
  "Tuberculosis",
  "Diabetes",
  "Others",
];

export default function EditPatientPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    hospitalRegistrationNumber: "",
    name: "",
    recordDate: "",
    territoryName: "Firdavsi",
    disease: "Flu",
    recoveryDate: "", // новое поле
  });

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPatientById(Number(id));
        const patientData = response.data;
        setPatient(patientData);
        setForm({
          hospitalRegistrationNumber: patientData.hospitalRegistrationNumber || "",
          name: patientData.name || "",
          recordDate: patientData.recordDate
            ? patientData.recordDate.split("T")[0]
            : "",
          territoryName: patientData.territoryName || "Firdavsi",
          disease: patientData.disease || "Flu",
          recoveryDate: patientData.recoveryDate
            ? patientData.recoveryDate.split("T")[0]
            : "", // инициализация
        });
      } catch (err) {
        console.error("Ошибка при загрузке пациента:", err);
        setError("Не удалось загрузить информацию о пациенте");
      } finally {
        setLoading(false);
      }
    };
    loadPatient();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updatePatient(Number(id), form);
      setSuccess(true);
      setTimeout(() => navigate("/patients"), 1500);
    } catch (err) {
      console.error("Ошибка при обновлении пациента:", err);
      setError("Не удалось обновить пациента. Проверьте подключение к серверу.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error && !patient) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Alert severity="error">{error}</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/patients")}
            sx={{ mt: 2, color: "white" }}
          >
            Назад к списку
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            p: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <EditIcon sx={{ fontSize: 40, color: "white" }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: "white" }}>
              Редактировать пациента
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>
            Обновите информацию о пациенте {patient?.name}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Пациент успешно обновлен! Перенаправление...
          </Alert>
        )}

        <Card
          sx={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="Регистрационный номер больницы"
                  name="hospitalRegistrationNumber"
                  value={form.hospitalRegistrationNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" }, "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" } }, "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" } }}
                   />
                <TextField
                  label="Имя пациента"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                   sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" }, "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" } }, "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" } }}
                />
                <TextField
                  label="Дата регистрации"
                  type="date"
                  name="recordDate"
                  value={form.recordDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                   sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" }, "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" } }, "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" } }}
                />
                <TextField
                  select
                  label="Территория"
                  name="territoryName"
                  value={form.territoryName}
                  onChange={handleChange}
                  fullWidth
                   sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" }, "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" } }, "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" } }}
                >
                  {territories.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Болезнь"
                  name="disease"
                  value={form.disease}
                  onChange={handleChange}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" }, "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" } }, "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" } }} 
                >
                  {diseases.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Поле для даты выздоровления */}
                <TextField
                  label="Дата выздоровления"
                  type="date"
                  name="recoveryDate"
                  value={form.recoveryDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                   sx={{ "& .MuiOutlinedInput-root": { color: "white", "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)" }, "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" } }, "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" } }}
                />

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={saving}
                    sx={{
                      flex: 1,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
                      "&:hover": { boxShadow: "0 6px 30px rgba(102, 126, 234, 0.6)" },
                    }}
                  >
                    {saving ? "Сохранение..." : "Обновить"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/patients")}
                    disabled={saving}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "white",
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.5)",
                        background: "rgba(255, 255, 255, 0.05)",
                      },
                    }}
                  >
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
