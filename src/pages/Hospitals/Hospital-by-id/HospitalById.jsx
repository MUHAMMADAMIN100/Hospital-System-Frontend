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
  useMediaQuery,
  useTheme,
} from "@mui/material"
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import EditIcon from "@mui/icons-material/Edit"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import BusinessIcon from "@mui/icons-material/Business"
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
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none", borderRadius: 12 } } },
    MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 8 } } },
  },
})

export default function HospitalById() {
  const navigate = useNavigate()
  const { id } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

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
        if (res.isSuccess && res.data) setHospital(res.data)
        else setError(res.message || "Больница не найдена")
      } catch {
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
        {/* AppBar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Toolbar
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocalHospitalIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Медицинская Аналитика
              </Typography>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/hospitals")} sx={{ mb: 3, width: { xs: "100%", sm: "auto" } }}>
            Назад к списку
          </Button>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
              <CircularProgress size={50} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          ) : hospital ? (
            <Paper sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.paper", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              {/* Header */}
              <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "flex-start" : "center"} sx={{ mb: 3, gap: { xs: 2, sm: 0 } }}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <LocalHospitalIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: "primary.main" }} />
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "1.2rem", sm: "2rem" },
                        background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        overflowWrap: "break-word",
                      }}
                    >
                      {hospital.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Регистрационный номер: {hospital.registrationNumber}
                    </Typography>
                  </Box>
                </Stack>
                <Button variant="contained" startIcon={<EditIcon />} sx={{ width: { xs: "100%", sm: "auto" } }} onClick={() => navigate(`/hospitals/edit/${hospital.registrationNumber}`)}>
                  Редактировать
                </Button>
              </Stack>

              <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

              <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <BusinessIcon sx={{ color: "primary.main" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Административная информация
                      </Typography>
                    </Stack>
                    <Stack spacing={1}>
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
                          sx={{ mt: 0.5, bgcolor: "rgba(59, 130, 246, 0.2)", color: "primary.main", fontWeight: 600 }}
                        />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, bgcolor: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                      <LocationOnIcon sx={{ color: "secondary.main" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Местоположение
                      </Typography>
                    </Stack>
                    <Stack spacing={1}>
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