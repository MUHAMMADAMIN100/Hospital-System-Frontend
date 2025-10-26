import React, { useState, useEffect } from "react"
import { getReportAllTerritoriesExtended, getReportByTerritory } from "../../api/reports"
import {
  Box, Container, Paper, Typography, TextField, MenuItem, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Grid, Card, CardContent, Stack, Chip, CircularProgress,
  ThemeProvider, createTheme, CssBaseline, AppBar, Alert, AlertTitle
} from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import PeopleIcon from "@mui/icons-material/People"
import AssessmentIcon from "@mui/icons-material/Assessment"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import "jspdf-autotable"

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

export default function MedicalDashboard() {
  const [territory, setTerritory] = useState("All")
  const [dateFrom, setDateFrom] = useState("2025-10-01")
  const [dateTo, setDateTo] = useState("2025-10-31")
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const territories = ["All", "Firdavsi", "Shohmansur", "Sino", "Somoni"]

  const fetchReport = async () => {
    setLoading(true)
    setError(null)
    try {
      let data = []
      if (territory === "All") {
        const response = await getReportAllTerritoriesExtended(dateFrom, dateTo)
        data = response.data || response
      } else {
        const response = await getReportByTerritory(territory, dateFrom, dateTo)
        const single = response.data ? response.data : response
        if (!single.territory) single.territory = territory
        data = [single]
      }
      setReport(data)
    } catch (err) {
      console.error(err)
      if (err.message === "Network Error") {
        setError("Не удалось подключиться к серверу. Проверьте, запущен ли API сервер на http://localhost:5225")
      } else if (err.response) {
        setError(`Ошибка сервера: ${err.response.status} - ${err.response.statusText}`)
      } else {
        setError(`Ошибка: ${err.message}`)
      }
      setReport([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [territory])

  const aggregatedReport = report.length > 0
    ? report.reduce(
      (acc, cur) => {
        acc.patientsTotal += cur.patientsTotal
        acc.recoveredTotal += cur.recoveredTotal
        return acc
      },
      { patientsTotal: 0, recoveredTotal: 0 }
    )
    : null

  // --- Функции печати и PDF ---
const printReport = () => {
  if (!report || report.length === 0) {
    alert("Нет данных для печати.");
    return;
  }

  const printWindow = window.open("", "_blank", "width=900,height=700");
  const style = `
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        color: #111;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: right;
      }
      th:first-child, td:first-child {
        text-align: left;
      }
      th {
        background-color: #3b82f6;
        color: white;
      }
      tfoot td {
        font-weight: bold;
        background-color: #f1f5f9;
      }
      h1, h3 {
        text-align: center;
        margin: 0;
        padding: 0;
      }
      h1 {
        color: #3b82f6;
        margin-bottom: 5px;
      }
      h3 {
        color: #555;
        margin-bottom: 20px;
      }
    </style>
  `;

  // Подсчёт итогов по всем территориям
  const totalFluAndCold = report.reduce((sum, r) => sum + r.fluAndColdTotal, 0);
  const totalTyphoid = report.reduce((sum, r) => sum + r.typhoidTotal, 0);
  const totalHepatitis = report.reduce((sum, r) => sum + r.hepatitisTotal, 0);
  const totalOtherDiseases = report.reduce((sum, r) => sum + r.otherDiseasesTotal, 0);
  const totalPatients = report.reduce((sum, r) => sum + r.patientsTotal, 0);
  const totalRecovered = report.reduce((sum, r) => sum + r.recoveredTotal, 0);
  const recoveryPercent = totalPatients > 0 ? Math.round((totalRecovered * 100) / totalPatients) : 0;

  // Основные строки таблицы
  const tableRows = report.map(r => {
    const percentRecovered = r.patientsTotal > 0
      ? Math.round((r.recoveredTotal * 100) / r.patientsTotal)
      : 0;
    return `
      <tr>
        <td>${r.territory}</td>
        <td align="right">${r.fluAndColdTotal}</td>
        <td align="right">${r.typhoidTotal}</td>
        <td align="right">${r.hepatitisTotal}</td>
        <td align="right">${r.otherDiseasesTotal}</td>
        <td align="right">${r.patientsTotal}</td>
        <td align="right">${r.recoveredTotal}</td>
        <td align="right">${percentRecovered}%</td>
      </tr>
    `;
  }).join("");

  // Строка итогов
  const totalRow = `
    <tr>
      <td style="font-weight: bold;">Итого</td>
      <td align="right" style="font-weight: bold;">${totalFluAndCold}</td>
      <td align="right" style="font-weight: bold;">${totalTyphoid}</td>
      <td align="right" style="font-weight: bold;">${totalHepatitis}</td>
      <td align="right" style="font-weight: bold;">${totalOtherDiseases}</td>
      <td align="right" style="font-weight: bold;">${totalPatients}</td>
      <td align="right" style="font-weight: bold;">${totalRecovered}</td>
      <td align="right" style="font-weight: bold;">${recoveryPercent}%</td>
    </tr>
  `;

  // Заголовок таблицы
  const tableHeader = `
    <tr>
      <th>Территория</th>
      <th>Грипп / Простуда</th>
      <th>Тиф</th>
      <th>Гепатит</th>
      <th>Другие болезни</th>
      <th>Всего пациентов</th>
      <th>Выздоровели</th>
      <th>Процент выздоровления</th>
    </tr>
  `;

  // Печать
  printWindow.document.write(`
    <html>
      <head>
        <title>Отчёт по пациентам</title>
        ${style}
      </head>
      <body>
        <h1>Медицинский отчёт</h1>
        <h3>Период отчёта: ${dateFrom} — ${dateTo}</h3>
        <table>
          <thead>${tableHeader}</thead>
          <tbody>${tableRows}</tbody>
          <tfoot>${totalRow}</tfoot>
        </table>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
};








  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "background.paper", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        />

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
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
              Отчёт по пациентам
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Аналитика заболеваемости и выздоровления по территориям
            </Typography>
          </Box>

          {/* Фильтры */}
          <Paper sx={{ p: 3, mb: 4, bgcolor: "background.paper" }}>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Территория"
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value)}
                >
                  {territories.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Дата с"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Дата по"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={fetchReport}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                  sx={{ height: 56 }}
                >
                  {loading ? "Загрузка..." : "Обновить"}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Кнопки печати и PDF */}
          <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={printReport}>
              Печать отчёта
            </Button>
          </Box>

          {/* Ошибка */}
          {error && (
            <Alert
              severity="error"
              icon={<ErrorOutlineIcon />}
              sx={{ mb: 4, borderRadius: 2 }}
              onClose={() => setError(null)}
            >
              <AlertTitle sx={{ fontWeight: 600 }}>Ошибка подключения</AlertTitle>
              {error}
            </Alert>
          )}

          {/* Карточки статистики */}
          {aggregatedReport && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "background.paper", border: "1px solid rgba(59, 130, 246, 0.3)" }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                          Всего пациентов
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                          {aggregatedReport.patientsTotal}
                        </Typography>
                      </Box>
                      <PeopleIcon sx={{ color: "primary.main", fontSize: 40, opacity: 0.5 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "background.paper", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                          Выздоровели
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: "secondary.main" }}>
                          {aggregatedReport.recoveredTotal}
                        </Typography>
                      </Box>
                      <TrendingUpIcon sx={{ color: "secondary.main", fontSize: 40, opacity: 0.5 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ bgcolor: "background.paper", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                          Процент выздоровления
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: "#f59e0b" }}>
                          {aggregatedReport.patientsTotal > 0
                            ? Math.round((aggregatedReport.recoveredTotal * 100) / aggregatedReport.patientsTotal)
                            : 0}
                          %
                        </Typography>
                      </Box>
                      <AssessmentIcon sx={{ color: "#f59e0b", fontSize: 40, opacity: 0.5 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Таблица */}
          {report.length > 0 && (
            <Paper sx={{ p: 3, bgcolor: "background.paper" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Статистика по территориям
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: "primary.main" }}>Территория</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>Грипп / Простуда</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>Тиф</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>Гепатит</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>Другие болезни</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>Всего пациентов</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>Выздоровели</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>Процент выздоровления</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {report.map((territoryData) => {
                      const percentRecovered = territoryData.patientsTotal > 0
                        ? Math.round((territoryData.recoveredTotal * 100) / territoryData.patientsTotal)
                        : 0;
                      return (
                        <TableRow key={territoryData.territory} hover>
                          <TableCell>{territoryData.territory}</TableCell>
                          <TableCell align="right">{territoryData.fluAndColdTotal}</TableCell>
                          <TableCell align="right">{territoryData.typhoidTotal}</TableCell>
                          <TableCell align="right">{territoryData.hepatitisTotal}</TableCell>
                          <TableCell align="right">{territoryData.otherDiseasesTotal}</TableCell>
                          <TableCell align="right">{territoryData.patientsTotal}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={territoryData.recoveredTotal}
                              size="small"
                              sx={{ bgcolor: "rgba(16,185,129,0.2)", color: "secondary.main" }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600, color: "#f59e0b" }}>
                            {percentRecovered}%
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  )
}
