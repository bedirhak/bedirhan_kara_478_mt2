const axios = require(axios);


async function handleRequest(url, payload = undefined) {
    try {
        let data = {};
        if (payload) {
            data = await axios.post(url, payload);
        } else {
            data = await axios.get(url);
        }

        return [data.data, undefined];
    } catch (err) {
        return [undefined, err];
    }
}