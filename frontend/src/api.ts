import axios from "axios";
import type {Machine} from "./types";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getMachines = () =>
  API.get<Machine[]>("/machines");

export const getMachinesOrdered = (attribute: string, order: string) =>
  API.get<Machine[]>(`/machines?sort_by=${attribute}&order=${order}`)

export const createMachine = (data: Machine) =>
  API.post<Machine>("/machines", data);

export const updateMachine = (id: string, data: Machine) =>
  API.put<Machine>(`/machines/${id}`, data);

export const getMachineInfo = (id: string) =>
    API.get<Machine>(`/machines/${id}`)

export const deleteMachine = (id: string) =>
  API.delete(`/machines/${id}`);

export const uploadFile = (id: string, file: any) =>
    API.post<Machine>(`/machines/${id}/upload`, file)

export const deleteFile = (id: string) =>
    API.delete(`files/${id}`)