import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Chip,
  Alert,
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  MedicalServices as MedicalIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material"
import { getPatientById } from "../../api/patients"

export default function PatientInfoPage() {
  const navigate = useNavigate()
  const { id } = useParams() // id из URL

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getPatientById(Number(id))
        setPatient(response.data)
      } catch (err) {
        console.error("Ошибка при загрузке пациента:", err)
        setError("Не удалось загрузить информацию о пациенте")
      } finally {
        setLoading(false)
      }
    }
    loadPatient()
  }, [id])

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
    )
  }

  if (error || !patient) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Alert severity="error">{error || "Пациент не найден"}</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/patients")}
            sx={{ mt: 2, color: "white" }}
          >
            Назад к списку
          </Button>
        </Container>
      </Box>
    )
  }

  const InfoItem = ({ icon, label, value }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2,
        background: "rgba(255, 255, 255, 0.03)",
        borderRadius: 2,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Box sx={{ color: "#667eea", mt: 0.5 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", display: "block", mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  )

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
            <PersonIcon sx={{ fontSize: 40, color: "white" }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: "white" }}>
              {patient.name}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>
            ID пациента: {patient.id}
          </Typography>
        </Box>

        {/* Patient Info Card */}
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
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={<HospitalIcon />}
                  label="Регистрационный номер больницы"
                  value={patient.hospitalRegistrationNumber}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem icon={<LocationIcon />} label="Территория" value={patient.territoryName} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={<CalendarIcon />}
                  label="Дата записи"
                  value={new Date(patient.recordDate).toLocaleString("ru-RU")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={<CheckIcon />}
                  label="Дата выздоровления"
                  value={
                    patient.recoveryDate ? (
                      new Date(patient.recoveryDate).toLocaleString("ru-RU")
                    ) : (
                      <Chip label="Ещё не выздоровел" color="warning" size="small" />
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem icon={<MedicalIcon />} label="Болезнь" value={<Chip label={patient.disease} color="error" />} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoItem
                  icon={<CalendarIcon />}
                  label="Дата создания записи"
                  value={new Date(patient.createdAt).toLocaleString("ru-RU")}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/patients")}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            px: 3,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              boxShadow: "0 6px 30px rgba(102, 126, 234, 0.6)",
            },
          }}
        >
          Назад к списку
        </Button>
      </Container>
    </Box>
  )
}
