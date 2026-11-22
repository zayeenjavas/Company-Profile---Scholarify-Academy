const toBool = (val: string | undefined, defaultValue = false): boolean => {
  if (val === undefined) return defaultValue;
  return val.toLowerCase() === "true";
};

const globalMock = toBool(process.env.NEXT_PUBLIC_USE_MOCK, false);

export const apiEnv = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_V1_BASE_URL || "/api/v1",
  useMockAuth: toBool(process.env.NEXT_PUBLIC_USE_MOCK_AUTH, globalMock),
  useMockAdmin: toBool(process.env.NEXT_PUBLIC_USE_MOCK_ADMIN, globalMock),
  useMockExam: toBool(process.env.NEXT_PUBLIC_USE_MOCK_EXAM, globalMock),
};
