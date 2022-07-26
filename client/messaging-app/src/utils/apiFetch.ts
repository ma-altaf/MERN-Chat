const apiFetch = (
    route = "/",
    method: "GET" | "POST" | "DELETE" = "GET",
    body?: object,
    contentType = "application/json"
) =>
    fetch(process.env.REACT_APP_REST_API_URL + route, {
        method: method,
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": contentType,
        },
        body: JSON.stringify(body),
    });

export default apiFetch;
