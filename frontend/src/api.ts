import axios from "axios";
import type {Machine} from "./types";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getMachines = () =>
  API.get<Machine[]>("/machines");

export const createMachine = (data: Machine) =>
  API.post<Machine>("/machines", data);

export const updateMachine = (id: string, data: Machine) =>
  API.put<Machine>(`/machines/${id}`, data);

export const deleteMachine = (id: string) =>
  API.delete(`/machines/${id}`);