import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Alert,
  Divider,
  Grid,
} from "@mui/material"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditIcon from "@mui/icons-material/Edit"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import BusinessIcon from "@mui/icons-material/Business"
import PeopleIcon from "@mui/icons-material/People"
import AssessmentIcon from "@mui/icons-material/Assessment"
import { getHospitalById } from "../../../api/hospitals"

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
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none", borderRadius: 12 } },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", borderRadius: 8 } },
    },
  },
})

export default function HospitalById() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchHospital = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getHospitalById(id)
        if (res.isSuccess && res.data) {
          setHospital(res.data)
        } else {
          setError(res.message || "Больница не найдена")
        }
      } catch (err) {
        console.error(err)
        setError("Ошибка при загрузке данных больницы")
      } finally {
        setLoading(false)
      }
    }

    fetchHospital()
  }, [id])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        {/* Верхняя панель */}
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "background.paper", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Toolbar>
            <LocalHospitalIcon sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Медицинская Аналитика
            </Typography>
            <Button color="inherit" startIcon={<LocalHospitalIcon />} sx={{ mr: 2 }} onClick={() => navigate("/hospitals")}>
              Hospitals
            </Button>
            <Button color="inherit" startIcon={<PeopleIcon />} sx={{ mr: 2 }}>
              Patients
            </Button>
            <Button color="inherit" startIcon={<AssessmentIcon />} onClick={() => navigate("/")}>
              Reports
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/hospitals")} sx={{ mb: 3 }}>
            Назад к списку
          </Button>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          ) : hospital ? (
            <Paper sx={{ p: 4, bgcolor: "background.paper", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <LocalHospitalIcon sx={{ fontSize: 48, color: "primary.main" }} />
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
                      {hospital.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Регистрационный номер: {hospital.registrationNumber}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/hospitals/edit/${hospital.registrationNumber}`)}
                >
                  Редактировать
                </Button>
              </Stack>

              <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, bgcolor: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <BusinessIcon sx={{ color: "primary.main" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Административная информация
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Министерство
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {hospital.ministryName}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Территория
                        </Typography>
                        <Chip
                          label={hospital.territoryName}
                          size="small"
                          sx={{
                            mt: 0.5,
                            bgcolor: "rgba(59, 130, 246, 0.2)",
                            color: "primary.main",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, bgcolor: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <LocationOnIcon sx={{ color: "secondary.main" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Местоположение
                      </Typography>
                    </Stack>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Город
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {hospital.cityName}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Район
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {hospital.districtName}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          ) : null}
        </Container>
      </Box>
    </ThemeProvider>
  )
}
