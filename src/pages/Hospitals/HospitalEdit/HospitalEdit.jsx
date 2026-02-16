import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Stack,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import PeopleIcon from "@mui/icons-material/People"
import AssessmentIcon from "@mui/icons-material/Assessment"
import { getHospitalById, updateHospital } from "../../../api/hospitals"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3b82f6" },
    secondary: { main: "#10b981" },
    background: { default: "#0a0a0a", paper: "#1a1a1a" },
    text: { primary: "#ffffff", secondary: "#a0a0a0" },
  },
  typography: { fontFamily: "Geist, sans-serif" },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none", borderRadius: 12 } } },
    MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 8 } } },
  },
})

const territories = [
  { label: "Firdavsi", value: 0 },
  { label: "Somoni", value: 1 },
  { label: "Shohmansur", value: 2 },
  { label: "Sino", value: 3 },
]

export default function HospitalEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: "",
    ministryName: "",
    territoryName: "",
    districtName: "",
    cityName: "",
  })

  useEffect(() => {
    if (!id) return

    const fetchHospital = async () => {
      try {
        setLoading(true)
        const res = await getHospitalById(id)
        const data = res.data
        setForm({
          name: data.name || "",
          ministryName: data.ministryName || "",
          territoryName: data.territoryName || "",
          districtName: data.districtName || "",
          cityName: data.cityName || "",
        })
      } catch (err) {
        setError("Ошибка при загрузке данных больницы")
      } finally {
        setLoading(false)
      }
    }

    fetchHospital()
  }, [id])

const handleChange = (e) => {
  const { name, value } = e.target
  setForm((prev) => ({
    ...prev,
    [name]: name === "territoryName" ? Number(value) : value
  }))
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await updateHospital(id, form)
      setSuccess(true)
      setTimeout(() => navigate("/hospitals"), 1500)
    } catch (err) {
      const message = err.response?.data?.message || "Ошибка при обновлении больницы"
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
          <CircularProgress size={60} />
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Toolbar
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <LocalHospitalIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Медицинская Аналитика
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/hospitals")}
            sx={{ mb: 3, width: { xs: "100%", sm: "auto" } }}
          >
            Назад к списку
          </Button>

          <Paper sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.paper", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4, flexWrap: "wrap" }}>
              <LocalHospitalIcon sx={{ fontSize: { xs: 36, sm: 40 }, color: "primary.main" }} />
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Редактировать больницу
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Обновите информацию о медицинском учреждении
                </Typography>
              </Box>
            </Stack>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Больница успешно обновлена! Перенаправление...
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField fullWidth label="Название больницы" name="name" value={form.name} onChange={handleChange} required placeholder="Введите название больницы" />
                <TextField fullWidth label="Министерство" name="ministryName" value={form.ministryName} onChange={handleChange} required placeholder="Введите название министерства" />
                <TextField
                  select
                  fullWidth
                  label="Территория"
                  name="territoryName"
                  value={form.territoryName}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">Выберите территорию</MenuItem>
                  {territories.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField fullWidth label="Район" name="districtName" value={form.districtName} onChange={handleChange} required placeholder="Введите название района" />
                <TextField fullWidth label="Город" name="cityName" value={form.cityName} onChange={handleChange} required placeholder="Введите название города" />

                <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ pt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth={isMobile}
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{
                      background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #2563eb 0%, #059669 100%)",
                      },
                    }}
                  >
                    {saving ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                  <Button variant="outlined" size="large" fullWidth={isMobile} onClick={() => navigate("/hospitals")} disabled={saving}>
                    Отмена
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}