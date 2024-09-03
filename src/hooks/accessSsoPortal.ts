"use client";

import { api } from "@/service/apiClient";

export async function accessSsoPortal() {
  const sso = await api.post("auth/sso-portal");
  window.open(sso.data, "_blank");
}
