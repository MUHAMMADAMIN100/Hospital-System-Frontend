import { useState, useEffect } from "react"
import './../../App.css'
import { useNavigate } from "react-router-dom"
import {
  Box, Button, Card, CardContent, CircularProgress, Container,
  IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Pagination, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Chip,
} from "@mui/material"
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon,
  LocalHospital as HospitalIcon,
} from "@mui/icons-material"
import { getPatients, deletePatient } from "../../api/patients"

export default function PatientsListPage() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [patientToDelete, setPatientToDelete] = useState(null)
  const [error, setError] = useState(null)

  const pageSize = 5 // сколько элементов на странице

  // Загружаем все данные с сервера
  const loadPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPatients() // теперь без передачи страницы и размера
      setPatients(data || [])
    } catch (err) {
      console.error("Ошибка при загрузке пациентов:", err)
      setError("Не удалось загрузить список пациентов. Проверьте подключение к серверу.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return

    try {
      setLoading(true)
      await deletePatient(patientToDelete.id)
      setDeleteDialogOpen(false)
      setPatientToDelete(null)
      setPatients(prev => prev.filter(p => p.id !== patientToDelete.id))
    } catch (err) {
      console.error("Ошибка при удалении пациента:", err)
      setError("Не удалось удалить пациента")
    } finally {
      setLoading(false)
    }
  }

  const getDiseaseColor = (disease) => {
    const colors = {
      Flu: "info", Cold: "info", Fever: "warning", Hepatitis: "error",
      ARVI: "warning", Tuberculosis: "error", Diabetes: "warning", Others: "default",
    }
    return colors[disease] || "default"
  }

  // Фронтенд-пагинация
  const totalPages = Math.ceil(patients.length / pageSize)
  const displayedPatients = patients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)", py: 4  }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, p: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", borderRadius: 3, boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <HospitalIcon sx={{ fontSize: 40, color: "white" }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: "white" }}>Пациенты</Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.9)" }}>Управление базой данных пациентов</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/patients/new")}
            sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", px: 3, py: 1.5, fontSize: "1rem", fontWeight: 600, boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)", "&:hover": { boxShadow: "0 6px 30px rgba(102, 126, 234, 0.6)" } }}
          >
            Добавить пациента
          </Button>
        </Box>

        <Card sx={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)", borderRadius: 3, border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)" }}>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
            ) : displayedPatients.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)" }}>Пациенты не найдены</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ background: "transparent" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "rgba(255, 255, 255, 0.05)" }}>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>ID</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>Имя</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>Рег. больницы</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>Дата записи</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>Территория</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }}>Болезнь</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 600 }} align="right">Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {displayedPatients.map((patient) => (
                      <TableRow key={patient.id} sx={{ "&:hover": { background: "rgba(255, 255, 255, 0.05)" }, transition: "background 0.2s" }}>
                        <TableCell sx={{ color: "rgba(255,255,255,0.9)" }}>{patient.id}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.9)" }}>{patient.name}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.9)" }}>{patient.hospitalRegistrationNumber}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.9)" }}>{new Date(patient.recordDate).toLocaleDateString("ru-RU")}</TableCell>
                        <TableCell sx={{ color: "rgba(255,255,255,0.9)" }}>{patient.territoryName}</TableCell>
                        <TableCell><Chip label={patient.disease} color={getDiseaseColor(patient.disease)} size="small" /></TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => navigate(`/patients/${patient.id}`)} sx={{ color: "#4fc3f7" }}><InfoIcon /></IconButton>
                          <IconButton size="small" onClick={() => navigate(`/patients/edit/${patient.id}`)} sx={{ color: "#81c784" }}><EditIcon /></IconButton>
                          <IconButton size="small" onClick={() => handleDeleteClick(patient)} sx={{ color: "#e57373" }}><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination */}
            {!loading && patients.length > 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                  sx={{ "& .MuiPaginationItem-root": { color: "white" } }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)", color: "white", borderRadius: 2 } }}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены, что хотите удалить пациента <strong>{patientToDelete?.name}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "white" }}>Отмена</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" disabled={loading}>Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
