export const useFetchToAPI = () => {
  const sendData = async (route, uploadedObject) => {
    const response = await fetch(`http://localhost:3000${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadedObject),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al enviar los datos");
    }

    return data;
  };

  return { sendData };
};