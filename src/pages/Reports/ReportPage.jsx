

import { useState, useEffect } from "react"
import { getReportAllTerritoriesExtended, getReportByTerritory } from "../../api/reports.js"
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Alert,
  AlertTitle,
} from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import PeopleIcon from "@mui/icons-material/People"
import AssessmentIcon from "@mui/icons-material/Assessment"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

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

  const aggregatedReport =
    report.length > 0
      ? report.reduce(
        (acc, cur) => {
          acc.patientsTotal += cur.patientsTotal
          acc.recoveredTotal += cur.recoveredTotal
          return acc
        },
        { patientsTotal: 0, recoveredTotal: 0 },
      )
      : null

const printReport = () => {
  if (!report || report.length === 0) {
    alert("Нет данных для печати.");
    return;
  }

  const printWindow = window.open("", "_blank", "width=1000,height=800");

  // Текущая дата
  const currentDate = new Date();
  const docDate = currentDate.toLocaleDateString("ru-RU");
  const docNumber = `№ ${Math.floor(Math.random() * 1000)}`;
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  // Подсчёт итогов
  const totalFluAndCold = report.reduce((sum, r) => sum + (r.fluAndColdTotal || 0), 0);
  const totalTyphoid = report.reduce((sum, r) => sum + (r.typhoidTotal || 0), 0);
  const totalHepatitis = report.reduce((sum, r) => sum + (r.hepatitisTotal || 0), 0);
  const totalOtherDiseases = report.reduce((sum, r) => sum + (r.otherDiseasesTotal || 0), 0);
  const totalPatients = report.reduce((sum, r) => sum + (r.patientsTotal || 0), 0);
  const totalRecovered = report.reduce((sum, r) => sum + (r.recoveredTotal || 0), 0);
  const recoveryPercent =
    totalPatients > 0 ? Math.round((totalRecovered * 100) / totalPatients) : 0;

  // Таблица отчёта
  const tableRows = report
    .map((r) => {
      const percentRecovered =
        r.patientsTotal > 0 ? Math.round((r.recoveredTotal * 100) / r.patientsTotal) : 0;
      return `
        <tr>
          <td class="left">${r.territory || ""}</td>
          <td class="center">${r.fluAndColdTotal || 0}</td>
          <td class="center">${r.typhoidTotal || 0}</td>
          <td class="center">${r.hepatitisTotal || 0}</td>
          <td class="center">${r.otherDiseasesTotal || 0}</td>
          <td class="center">${r.patientsTotal || 0}</td>
          <td class="center">${r.recoveredTotal || 0}</td>
          <td class="center">${percentRecovered}%</td>
        </tr>
      `;
    })
    .join("");

  const totalRow = `
    <tr class="total-row">
      <td class="left"><strong>Итого</strong></td>
      <td class="center"><strong>${totalFluAndCold}</strong></td>
      <td class="center"><strong>${totalTyphoid}</strong></td>
      <td class="center"><strong>${totalHepatitis}</strong></td>
      <td class="center"><strong>${totalOtherDiseases}</strong></td>
      <td class="center"><strong>${totalPatients}</strong></td>
      <td class="center"><strong>${totalRecovered}</strong></td>
      <td class="center"><strong>${recoveryPercent}%</strong></td>
    </tr>
  `;

  const style = `
    <style>
      @page { 
        size: A4; 
        margin: 15mm 20mm 15mm 20mm; 
      }

      body { 
        font-family: 'Times New Roman', Times, serif; 
        color: #000; 
        font-size: 13px;
        line-height: 1.3;
        margin: 0;
        padding: 0;
      }

      .document-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        padding-bottom: 10px;
      }

      .doc-number {
        padding: 8px 12px;
        font-size: 12px;
        line-height: 1.4;
      }

      /* ---- Утверждаю с печатью ---- */
      .approval-section {
        position: relative;
        text-align: center;
        padding-top: 20px;
        min-height: 160px;
      }

      .approval-title {
        font-size: 13px;
        font-weight: 900;
        margin-bottom: 5px;
        text-transform: uppercase;
        position: relative;
        z-index: 1;
        display: inline-block;
      }

      .approval-subtitle {
        font-weight: 900;
        font-size: 11px;
        margin-bottom: 3px;
        position: relative;
        z-index: 1;
      }

      .stamp-area {
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%) rotate(-5deg);
        width: 140px;
        height: 140px;
        border: 2px solid #4169E1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;
        background: radial-gradient(circle, rgba(65,105,225,0.05) 0%, rgba(65,105,225,0.15) 100%);
        pointer-events: none;
        opacity: 0.95;
      }

      .stamp-image {
        width: 110px;
        height: 110px;
        object-fit: contain;
        opacity: 0.8;
        filter: contrast(1.1) saturate(0.9);
      }

      .signature-line {
        margin-top: 30px;
        border-bottom: 1px solid #000;
        width: 150px;
        display: inline-block;
        position: relative;
        z-index: 1;
      }

      .signature-name, .signature-date {
        font-size: 11px;
        margin-top: 5px;
        position: relative;
        z-index: 1;
      }

      .main-title {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        margin: 25px 0 15px 0;
        text-transform: uppercase;
      }

      .subtitle {
        text-align: center;
        font-size: 13px;
        margin: 8px 0;
        line-height: 1.5;
      }

      .organization-name {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        margin: 15px 0;
        line-height: 1.5;
      }

      .document-codes {
        margin: 20px 0;
        font-size: 12px;
        line-height: 1.8;
      }

      .code-line {
        display: flex;
        border-bottom: 1px solid #000;
        padding: 3px 0;
        margin: 2px 0;
      }

      .code-label {
        min-width: 200px;
      }

      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 25px 0;
        font-size: 12px;
      }
      
      th, td { 
        border: 1px solid #000; 
        padding: 6px 8px;
      }
      
      th { 
        background: #f0f0f0; 
        font-weight: bold; 
        text-align: center;
        font-size: 11px;
      }
      
      td.center { text-align: center; }
      td.left { text-align: left; }
      tr.total-row td { background: #f5f5f5; font-weight: bold; }

      .commission-section {
        margin-top: 35px;
        page-break-inside: avoid;
      }

      .commission-title {
        font-size: 13px;
        margin-bottom: 15px;
      }

      .commission-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      .commission-table td {
        border: none;
        border-bottom: 1px solid #000;
        padding: 8px 5px;
        font-size: 12px;
      }

      .commission-table .role { width: 120px; vertical-align: bottom; }
      .commission-table .signature { width: 100px; text-align: center; vertical-align: bottom; }
      .commission-table .name { vertical-align: bottom; }
      .commission-table .date { width: 100px; text-align: center; vertical-align: bottom; }

      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .stamp-area {
          border-color: #4169E1 !important;
          background: radial-gradient(circle, rgba(65,105,225,0.05) 0%, rgba(65,105,225,0.15) 100%) !important;
          z-index: 9999 !important;
        }
      }
    </style>
  `;

  const htmlContent = `
    <html>
      <head><meta charset="UTF-8">${style}</head>
      <body>
        <div class="document-header">
          <div class="doc-number">
            Договор<br/>
            ${docNumber}<br/>
            от ${docDate}
          </div>

          <div class="approval-section">
            <div class="stamp-area">
              <img src="https://avatars.mds.yandex.net/i?id=b228451a1a1210243f3105530279c22d0b0972d6-10476199-images-thumbs&n=13"
                   alt="Печать"
                   class="stamp-image"/>
            </div>

            <div style="margin-top: 120px;">
              <div class="approval-title">УТВЕРЖДАЮ</div>
              <div class="approval-subtitle">Председатель комиссии</div>
              <div class="approval-subtitle">по проведению специальной оценки</div>
              <div class="approval-subtitle">условий труда</div>

              <div class="signature-line"></div>
              <div class="signature-name">_______________ О.В.</div>
              <div class="signature-date">"___" _________ ${currentDate.getFullYear()}г.</div>
            </div>
          </div>
        </div>

        <div class="main-title">ОТЧЕТ</div>
        <div class="subtitle">о проведении специальной оценки условий труда</div>
        <div class="subtitle">(идентификационный № _______)</div>

        <div class="organization-name">
          в Государственном автономном<br/>
          учреждении здравоохранения<br/>
          «Детская городская клиническая<br/>
          больница № 8 г. Челябинск»
        </div>

        <div class="document-codes">
          <div class="code-line"><span class="code-label">Адрес:</span><span>454047, г. Челябинск, ул. Дружбы, 2</span></div>
          <div class="code-line"><span class="code-label">ОГРН:</span><span>7450006212</span></div>
          <div class="code-line"><span class="code-label">ИНН:</span><span>746001001</span></div>
          <div class="code-line"><span class="code-label">СНИЛС:</span><span>1027402618178</span></div>
          <div class="code-line"><span class="code-label">Код по ОКВЭД:</span><span>86.10</span></div>
          <div class="code-line"><span class="code-label">Вид деятельности:</span><span>Деятельность больничных организаций</span></div>
        </div>

        <table>
          <thead>
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
          </thead>
          <tbody>${tableRows}</tbody>
          <tfoot>${totalRow}</tfoot>
        </table>

        <div class="commission-section">
          <div class="commission-title">Члены комиссии:</div>
          <table class="commission-table">
            <tr><td class="role">Председатель</td><td class="signature">_________</td><td class="name">Петрова О.А.</td><td class="date">${formattedDate}</td></tr>
            <tr><td></td><td class="signature">_________</td><td class="name">Лопатин С.А.</td><td class="date">${formattedDate}</td></tr>
            <tr><td></td><td class="signature">_________</td><td class="name">Борисова О.М.</td><td class="date">${formattedDate}</td></tr>
            <tr><td></td><td class="signature">_________</td><td class="name">Харитонов П.В.</td><td class="date">${formattedDate}</td></tr>
            <tr><td></td><td class="signature">_________</td><td class="name">Толкова О.М.</td><td class="date">${formattedDate}</td></tr>
            <tr><td></td><td class="signature">_________</td><td class="name">Панкова А.С.</td><td class="date">${formattedDate}</td></tr>
          </table>
        </div>
      </body>
    </html>
  `;

  

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 500);
};


const printReportSvod = () => {
  if (!report || report.length === 0) {
    alert("Нет данных для печати.");
    return;
  }

  const printWindow = window.open("", "_blank", "width=1000,height=800");

  // Текущая дата
  const currentDate = new Date();
  const docDate = currentDate.toLocaleDateString("ru-RU");
  const docNumber = `№ ${Math.floor(Math.random() * 1000)}`;
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  // Подсчёт итогов
  const totalFluAndCold = report.reduce((sum, r) => sum + (r.fluAndColdTotal || 0), 0);
  const totalTyphoid = report.reduce((sum, r) => sum + (r.typhoidTotal || 0), 0);
  const totalHepatitis = report.reduce((sum, r) => sum + (r.hepatitisTotal || 0), 0);
  const totalOtherDiseases = report.reduce((sum, r) => sum + (r.otherDiseasesTotal || 0), 0);
  const totalPatients = report.reduce((sum, r) => sum + (r.patientsTotal || 0), 0);
  const totalRecovered = report.reduce((sum, r) => sum + (r.recoveredTotal || 0), 0);
  const recoveryPercent =
    totalPatients > 0 ? Math.round((totalRecovered * 100) / totalPatients) : 0;

  // Таблица отчёта
  const tableRows = report
    .map((r) => {
      const percentRecovered =
        r.patientsTotal > 0 ? Math.round((r.recoveredTotal * 100) / r.patientsTotal) : 0;
      return `
        <tr>
          <td class="left">${r.territory || ""}</td>
          <td class="center">${r.fluAndColdTotal || 0}</td>
          <td class="center">${r.typhoidTotal || 0}</td>
          <td class="center">${r.hepatitisTotal || 0}</td>
          <td class="center">${r.otherDiseasesTotal || 0}</td>
          <td class="center">${r.patientsTotal || 0}</td>
          <td class="center">${r.recoveredTotal || 0}</td>
          <td class="center">${percentRecovered}%</td>
        </tr>
      `;
    })
    .join("");

  const totalRow = `
    <tr class="total-row">
      <td class="left"><strong>Итого</strong></td>
      <td class="center"><strong>${totalFluAndCold}</strong></td>
      <td class="center"><strong>${totalTyphoid}</strong></td>
      <td class="center"><strong>${totalHepatitis}</strong></td>
      <td class="center"><strong>${totalOtherDiseases}</strong></td>
      <td class="center"><strong>${totalPatients}</strong></td>
      <td class="center"><strong>${totalRecovered}</strong></td>
      <td class="center"><strong>${recoveryPercent}%</strong></td>
    </tr>
  `;

  const style = `
    <style>
      @page { 
        size: A4; 
        margin: 15mm 20mm 15mm 20mm; 
      }

      body { 
        font-family: 'Times New Roman', Times, serif; 
        color: #000; 
        font-size: 13px;
        line-height: 1.3;
        margin: 0;
        padding: 0;
      }

      .document-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        padding-bottom: 10px;
      }

      .doc-number {
        padding: 8px 12px;
        font-size: 12px;
        line-height: 1.4;
      }

      /* ---- Утверждаю с печатью ---- */
      .approval-section {
        position: relative;
        text-align: center;
        padding-top: 20px;
        min-height: 160px;
      }

      .approval-title {
        font-size: 13px;
        font-weight: 900;
        margin-bottom: 5px;
        text-transform: uppercase;
        position: relative;
        z-index: 1;
        display: inline-block;
      }

      .approval-subtitle {
        font-weight: 900;
        font-size: 11px;
        margin-bottom: 3px;
        position: relative;
        z-index: 1;
      }

      .stamp-area {
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%) rotate(-5deg);
        width: 140px;
        height: 140px;
        border: 2px solid #4169E1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3;
        background: radial-gradient(circle, rgba(65,105,225,0.05) 0%, rgba(65,105,225,0.15) 100%);
        pointer-events: none;
        opacity: 0.95;
      }

      .stamp-image {
        width: 110px;
        height: 110px;
        object-fit: contain;
        opacity: 0.8;
        filter: contrast(1.1) saturate(0.9);
      }

      .signature-line {
        margin-top: 30px;
        border-bottom: 1px solid #000;
        width: 150px;
        display: inline-block;
        position: relative;
        z-index: 1;
      }

      .signature-name, .signature-date {
        font-size: 11px;
        margin-top: 5px;
        position: relative;
        z-index: 1;
      }

      .main-title {
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        margin: 25px 0 15px 0;
        text-transform: uppercase;
      }

      .subtitle {
        text-align: center;
        font-size: 13px;
        margin: 8px 0;
        line-height: 1.5;
      }

      .organization-name {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        margin: 15px 0;
        line-height: 1.5;
      }

      .document-codes {
        margin: 20px 0;
        font-size: 12px;
        line-height: 1.8;
      }

      .code-line {
        display: flex;
        border-bottom: 1px solid #000;
        padding: 3px 0;
        margin: 2px 0;
      }

      .code-label {
        min-width: 200px;
      }

      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 25px 0;
        font-size: 12px;
      }
      
      th, td { 
        border: 1px solid #000; 
        padding: 6px 8px;
      }
      
      th { 
        background: #f0f0f0; 
        font-weight: bold; 
        text-align: center;
        font-size: 11px;
      }
      
      td.center { text-align: center; }
      td.left { text-align: left; }
      tr.total-row td { background: #f5f5f5; font-weight: bold; }

      .commission-section {
        margin-top: 35px;
        page-break-inside: avoid;
      }

      .commission-title {
        font-size: 13px;
        margin-bottom: 15px;
      }

      .commission-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      .commission-table td {
        border: none;
        border-bottom: 1px solid #000;
        padding: 8px 5px;
        font-size: 12px;
      }

      .commission-table .role { width: 120px; vertical-align: bottom; }
      .commission-table .signature { width: 100px; text-align: center; vertical-align: bottom; }
      .commission-table .name { vertical-align: bottom; }
      .commission-table .date { width: 100px; text-align: center; vertical-align: bottom; }

      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .stamp-area {
          border-color: #4169E1 !important;
          background: radial-gradient(circle, rgba(65,105,225,0.05) 0%, rgba(65,105,225,0.15) 100%) !important;
          z-index: 9999 !important;
        }
      }
    </style>
  `;

  const htmlContent = `
    <html>
      <head><meta charset="UTF-8">${style}</head>
      <body>
        <div class="document-header">
          <div class="doc-number">
            Договор<br/>
            ${docNumber}<br/>
            от ${docDate}
          </div>

          <div class="approval-section">
            <div class="stamp-area">
              <img src="https://avatars.mds.yandex.net/i?id=b228451a1a1210243f3105530279c22d0b0972d6-10476199-images-thumbs&n=13"
                   alt="Печать"
                   class="stamp-image"/>
            </div>

            <div style="margin-top: 120px;">
              <div class="approval-title">УТВЕРЖДАЮ</div>
              <div class="approval-subtitle">Председатель комиссии</div>
              <div class="approval-subtitle">по проведению специальной оценки</div>
              <div class="approval-subtitle">условий труда</div>

              <div class="signature-line"></div>
              <div class="signature-name">_______________ О.В.</div>
              <div class="signature-date">"___" _________ ${currentDate.getFullYear()}г.</div>
            </div>
          </div>
        </div>

        <div class="main-title"> СВОДНЫЙ ОТЧЕТ</div>
        <div class="subtitle">о проведении специальной оценки условий труда</div>
        <div class="subtitle">(идентификационный № _______)</div>

        <div class="organization-name">
          в Государственном автономном<br/>
          учреждении здравоохранения<br/>
          «Детская городская клиническая<br/>
          больница № 8 г. Челябинск»
        </div>

        <div class="document-codes">
          <div class="code-line"><span class="code-label">Адрес:</span><span>454047, г. Челябинск, ул. Дружбы, 2</span></div>
          <div class="code-line"><span class="code-label">ОГРН:</span><span>7450006212</span></div>
          <div class="code-line"><span class="code-label">ИНН:</span><span>746001001</span></div>
          <div class="code-line"><span class="code-label">СНИЛС:</span><span>1027402618178</span></div>
          <div class="code-line"><span class="code-label">Код по ОКВЭД:</span><span>86.10</span></div>
          <div class="code-line"><span class="code-label">Вид деятельности:</span><span>Деятельность больничных организаций</span></div>
        </div>

        <table>
          <thead>
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
          </thead>
          <tbody>${tableRows}</tbody>
          <tfoot>${totalRow}</tfoot>
        </table>

        <div class="commission-section">
          <div class="commission-title">Члены комиссии:</div>
          <table class="commission-table">
            <tr><td class="role">Председатель</td><td class="signature">_________</td><td class="name">Петрова О.А.</td><td class="date">${formattedDate}</td></tr>
            <tr><td></td><td class="signature">_________</td><td class="name">Лопатин С.А.</td><td class="date">${formattedDate}</td></tr>
            <tr><td></td><td class="signature">_________</td><td class="name">Борисова О.М.</td><td class="date">${formattedDate}</td></tr>
            <tr><td></td><td class="signature">_________</td><td class="name">Харитонов П.В.</td><td class="date">${formattedDate}</td></tr>
            <tr><td></td><td class="signature">_________</td><td class="name">Толкова О.М.</td><td class="date">${formattedDate}</td></tr>
            <tr><td></td><td class="signature">_________</td><td class="name">Панкова А.С.</td><td class="date">${formattedDate}</td></tr>
          </table>
        </div>
      </body>
    </html>
  `;

  

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 500);
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

          {/* Кнопки печати */}
          <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={printReport}>
              Печать отчёта
            </Button>
            <Button variant="contained" color="primary" onClick={printReportSvod}>
              Печать сводного отчёта
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
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>
                        Грипп / Простуда
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>
                        Тиф
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>
                        Гепатит
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>
                        Другие болезни
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>
                        Всего пациентов
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>
                        Выздоровели
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>
                        Процент выздоровления
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {report.map((territoryData) => {
                      const percentRecovered =
                        territoryData.patientsTotal > 0
                          ? Math.round((territoryData.recoveredTotal * 100) / territoryData.patientsTotal)
                          : 0
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


