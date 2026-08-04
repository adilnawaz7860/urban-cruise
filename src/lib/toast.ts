import { Toast } from "@base-ui/react/toast";

export const toastManager = Toast.createToastManager();

export const toast = {
  success: (description: string, title = "Success") =>
    toastManager.add({ title, description, type: "success" }),
  error: (description: string, title = "Error") =>
    toastManager.add({ title, description, type: "error", timeout: 6000 }),
  info: (description: string, title?: string) =>
    toastManager.add({ title, description, type: "info" }),
};
