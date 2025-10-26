import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Stack,
  Chip,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Pagination,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getHospitals, deleteHospital } from "../../api/hospitals";

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
});

export default function HospitalsList() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]); // теперь просто массив
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);

  const pageSize = 10;
  const totalPages = Math.ceil(hospitals.length / pageSize);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getHospitals(); // без параметров, т.к. пагинация локальная
      setHospitals(res.data || res); // если API возвращает {data}, берем data
    } catch (err) {
      console.error("Ошибка при загрузке больниц:", err);
      setError("Не удалось загрузить список больниц. Проверьте подключение к серверу.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleDeleteClick = (hospital) => {
    setHospitalToDelete(hospital);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!hospitalToDelete) return;
    try {
      await deleteHospital(hospitalToDelete.registrationNumber);
      setHospitals((prev) => prev.filter((h) => h.registrationNumber !== hospitalToDelete.registrationNumber));
      setDeleteDialogOpen(false);
      setHospitalToDelete(null);

      // если после удаления страница пустая — возвращаемся на предыдущую
      if ((page - 1) * pageSize >= hospitals.length - 1) {
        setPage((prev) => Math.max(prev - 1, 1));
      }
    } catch (err) {
      console.error(err);
      setError("Ошибка при удалении больницы");
    }
  };

  // Данные для текущей страницы
  const paginatedData = hospitals.slice((page - 1) * pageSize, page * pageSize);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: "1px solid rgba(255,255,255,0.1)" }} />

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Больницы
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Управление медицинскими учреждениями
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate("/hospitals/new")}
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                "&:hover": { background: "linear-gradient(135deg, #2563eb 0%, #059669 100%)" },
              }}
            >
              Создать больницу
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
              <CircularProgress size={60} />
            </Box>
          ) : hospitals.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center", bgcolor: "background.paper" }}>
              <LocalHospitalIcon sx={{ fontSize: 80, color: "text.secondary", opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Больницы не найдены
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/hospitals/new")}>
                Создать больницу
              </Button>
            </Paper>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedData.map((hospital) => (
                  <Grid item xs={12} sm={6} md={4} key={hospital.registrationNumber}>
                    <Card
                      sx={{
                        bgcolor: "background.paper",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        "&:hover": { borderColor: "primary.main", transform: "translateY(-4px)", boxShadow: "0 8px 24px rgba(59, 130, 246, 0.2)" },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
                          <LocalHospitalIcon sx={{ color: "primary.main", fontSize: 32 }} />
                          <Chip
                            label={hospital.territoryName || "—"}
                            size="small"
                            sx={{ bgcolor: "rgba(59, 130, 246, 0.2)", color: "primary.main", fontWeight: 600 }}
                          />
                        </Stack>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "primary.main" }}>
                          {hospital.name}
                        </Typography>
                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {hospital.cityName}, {hospital.districtName}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Министерство: {hospital.ministryName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Рег. №: {hospital.registrationNumber}
                          </Typography>
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button size="small" startIcon={<VisibilityIcon />} onClick={() => navigate(`/hospitals/${hospital.registrationNumber}`)}>
                          Открыть
                        </Button>
                        <Button size="small" startIcon={<EditIcon />} color="warning" onClick={() => navigate(`/hospitals/edit/${hospital.registrationNumber}`)}>
                          Изменить
                        </Button>
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(hospital)} sx={{ ml: "auto" }}>
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" size="large" />
                </Box>
              )}
            </>
          )}
        </Container>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { bgcolor: "background.paper", borderRadius: 2 } }}>
          <DialogTitle sx={{ fontWeight: 600 }}>Подтверждение удаления</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Вы уверены, что хотите удалить больницу "{hospitalToDelete?.name}"? Это действие нельзя отменить.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
