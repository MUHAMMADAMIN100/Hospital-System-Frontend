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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Pagination,
  IconButton,
  useTheme,
  useMediaQuery,
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
  },
  typography: { fontFamily: "Geist, sans-serif" },
});

export default function HospitalsList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState(null);

  const pageSize = 10;
  const totalPages = Math.ceil(hospitals.length / pageSize);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const res = await getHospitals();
        setHospitals(res.data || res);
      } catch (error) {
        setError("Не удалось загрузить список больниц.");
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!hospitalToDelete) return;

    try {
      await deleteHospital(hospitalToDelete.registrationNumber);
      const updated = hospitals.filter(
        (h) =>
          h.registrationNumber !== hospitalToDelete.registrationNumber
      );
      setHospitals(updated);

      if ((page - 1) * pageSize >= updated.length) {
        setPage((p) => Math.max(p - 1, 1));
      }

      setDeleteDialogOpen(false);
      setHospitalToDelete(null);
    } catch {
      setError("Ошибка при удалении больницы");
    }
  };

  const paginatedData = hospitals.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              mb: 4,

              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Больницы
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}
              >
                Управление медицинскими учреждениями
              </Typography>
            </Box>

            <Button
              fullWidth={isMobile}
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/hospitals/new")}
              sx={{
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
              }}
            >
              Создать больницу
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          ) : hospitals.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <LocalHospitalIcon sx={{ fontSize: 70, mb: 2 }} />
              <Typography>Больницы не найдены</Typography>
            </Paper>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedData.map((hospital) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={hospital.registrationNumber}
                  >
                    <Card className="card"

                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "0.3s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                        },
                      }}
                  
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ mb: 2 }}
                        >
                          <LocalHospitalIcon color="primary" />
                          <Chip
                            label={hospital.territoryName || "—"}
                            size="small"
                            className="nameHosp"
                          />
                        </Stack>

                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 2 }}
                        >
                          {hospital.name}
                        </Typography>

                        <Stack spacing={1}>
                          <Stack direction="row" spacing={1}>
                            <LocationOnIcon fontSize="small" />
                            <Typography variant="body2">
                              {hospital.cityName}, {hospital.districtName}
                            </Typography>
                          </Stack>

                          <Typography variant="body2">
                            Министерство: {hospital.ministryName}
                          </Typography>

                          <Typography variant="caption">
                            Рег. №: {hospital.registrationNumber}
                          </Typography>
                        </Stack>
                      </CardContent>

                      <CardActions
                        sx={{
                          p: 2,
                          pt: 0,
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 1,
                        }}
                      >
                        <Button
                          size="small"
                          fullWidth={isMobile}
                          startIcon={<VisibilityIcon />}
                          onClick={() =>
                            navigate(
                              `/hospitals/${hospital.registrationNumber}`
                            )
                          }
                        >
                          Открыть
                        </Button>

                        <Button
                          size="small"
                          fullWidth={isMobile}
                          startIcon={<EditIcon />}
                          color="warning"
                          onClick={() =>
                            navigate(
                              `/hospitals/edit/${hospital.registrationNumber}`
                            )
                          }
                        >
                          Изменить
                        </Button>

                        <IconButton
                          color="error"
                          sx={{
                            ml: { sm: "auto" },
                            alignSelf: { xs: "center", sm: "center" },
                          }}
                          onClick={() => {
                            setHospitalToDelete(hospital);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    size={isMobile ? "medium" : "large"}
                  />
                </Box>
              )}
            </>
          )}
        </Container>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Удалить больницу "{hospitalToDelete?.name}"?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteConfirm}
            >
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider >
  );
}