const isProduction = process.env.NODE_ENV === 'production';

const getApiIp = () => {
  if (isProduction) {
    return `${window.location.hostname}`;
  }
  return '10.0.1.10';
};

export const API_IP = getApiIp();