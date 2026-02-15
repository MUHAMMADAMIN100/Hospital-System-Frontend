// src/api/hospitals.js
import axios from "axios";
const API_URL = "https://hospital-system-backend-rqkm.onrender.com/api/Hospital";

// Получение списка больниц
export const getHospitals = async (params) => {
  try {
    const response = await axios.get(API_URL, { params });
    // Если API возвращает просто массив
    if (Array.isArray(response.data)) {
      return { data: response.data, totalCount: response.data.length };
    }
    // Если API возвращает объект с данными и totalCount
    if (response.data?.data) {
      return {
        data: response.data.data,
        totalCount: response.data.totalCount || response.data.data.length
      };
    }
    // fallback (если структура иная)
    return { data: [response.data], totalCount: 1 };
  } catch (err) {
    console.error("Ошибка при получении больниц:", err);
    throw err;
  }
};

// Получение больницы по registrationNumber
export const getHospitalById = async (registrationNumber) => {
  const response = await axios.get(`${API_URL}/by-id`, {
    params: { registrationNumber },
  });
  return response.data;
};

// Создание больницы
export const createHospital = async (hospitalData) => {
  try {
    const response = await axios.post(`${API_URL}`, hospitalData);
    return response.data;
  } catch (err) {
    console.error("Ошибка при создании больницы:", err);
    throw err;
  }
};

// Обновление больницы
export const updateHospital = async (registrationNumber, hospitalData) => {
  try {
    const response = await axios.put(`${API_URL}`, hospitalData, {
      params: { registrationNumber },
    });
    return response.data;
  } catch (err) {
    console.error("Ошибка при обновлении больницы:", err);
    throw err;
  }
};

// Удаление больницы
  export const deleteHospital = async (id) => {
    try {
      // Передаём ID как часть пути
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      console.error("Ошибка при удалении больницы:", err);
      throw err;
    }
  };
