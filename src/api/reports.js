import axios from "axios";

const REPORT_API_URL = "http://localhost:5225/api/Report";

// Получить сводную статистику по всем территориям
export const getReportAllTerritories = async (dateFrom, dateTo) => {
  try {
    const response = await axios.get(`${REPORT_API_URL}/all`, {
      params: { dateFrom, dateTo },
    });
    return response.data;
  } catch (err) {
    console.error("Ошибка при получении отчёта по всем территориям:", err);
    throw err;
  }
};

export const getReportAllTerritoriesExtended = async (dateFrom, dateTo) => {
  try {
    const response = await axios.get(`${REPORT_API_URL}/all-extended`, {
      params: { dateFrom, dateTo },
    });
    return response.data; // ожидаем массив объектов по территориям + суммарные значения
  } catch (err) {
    console.error("Ошибка при получении расширённого отчёта по всем территориям:", err);
    throw err;
  }
};

// Получить отчёт по конкретной территории (Firdavsi, Somoni, Shohmansur, Sino)
export const getReportByTerritory = async (territoryName, dateFrom, dateTo) => {
  try {
    const response = await axios.get(`${REPORT_API_URL}`, {
      params: { territoryName, dateFrom, dateTo },
    });
    return response.data;
  } catch (err) {
    console.error(`Ошибка при получении отчёта по территории ${territoryName}:`, err);
    throw err;
  }
};

// Отдельные функции для каждой территории (опционально)
export const getReportFirdavsi = async (dateFrom, dateTo) => {
  return getReportByTerritory("Firdavsi", dateFrom, dateTo);
};

export const getReportSomoni = async (dateFrom, dateTo) => {
  return getReportByTerritory("Somoni", dateFrom, dateTo);
};

export const getReportShohmansur = async (dateFrom, dateTo) => {
  return getReportByTerritory("Shohmansur", dateFrom, dateTo);
};

export const getReportSino = async (dateFrom, dateTo) => {
  return getReportByTerritory("Sino", dateFrom, dateTo);
};
