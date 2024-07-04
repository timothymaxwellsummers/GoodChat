export const saveMessagesToLocalStorage = async (
  key: string,
  messages: any[]
): Promise<void> => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(messages));
  }
};

export const loadMessagesFromLocalStorage = (key: string): any[] => {
  if (typeof window !== "undefined") {
    const storedMessages = localStorage.getItem(key);
    if (storedMessages) {
      return JSON.parse(storedMessages);
    }
  }
  return [];
};

export const saveProfileData = (data: string): void => {
    if (typeof window !== "undefined") {
        localStorage.setItem("profile.json", data);
    }
};

export const getProfileData = (): string => {
  return typeof window !== "undefined" ? JSON.stringify(localStorage.getItem("profile.json")).replace(/[{}]/g, '') : "";
};
