const apiFetch = (
    route = "/",
    method: "GET" | "POST" | "DELETE" = "GET",
    body?: object
) =>
    fetch(process.env.REACT_APP_REST_API_URL + route, {
        method: method,
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

export default apiFetch;
