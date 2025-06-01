async function fetchModel(url) {
  try {
    const response = await fetch(`http://localhost:8081/api${url}`);
    if(!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch(error){
    console.error("fetchModel error:", error);
    return null;
  }
}

export default fetchModel;
