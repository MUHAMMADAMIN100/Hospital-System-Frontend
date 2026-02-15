
import axios from "axios";

const API_URL = "https://hospital-system-backend-rqkm.onrender.com/api/PatientControllers";

// Получить всех пациентов с фильтрацией и пагинацией
export const getPatients = async (pageNumber = 1, pageSize = 10) => {
  const response = await axios.get(API_URL, {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return response.data;
};

// Получить одного пациента по ID
export const getPatientById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error("Ошибка при получении пациента:", err);
    throw err;
  }
};

// Создать пациента
export const createPatient = async (patientData) => {
  try {
    const response = await axios.post(API_URL, patientData);
    return response.data;
  } catch (err) {
    console.error("Ошибка при создании пациента:", err);
    throw err;
  }
};

// Обновить пациента
export const updatePatient = async (id, patientData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, patientData);
    return response.data;
  } catch (err) {
    console.error("Ошибка при обновлении пациента:", err);
    throw err;
  }
};

// Удалить пациента
export const deletePatient = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (err) {
    console.error("Ошибка при удалении пациента:", err);
    throw err;
  }
};
