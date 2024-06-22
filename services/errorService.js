const handleError = (error, res) => {
    if (error.response) {
        console.error(`HTTP error: ${error.response.status}`);
        res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
        console.error('Request error: No response received');
        res.status(500).send('Request error: No response received');
    } else {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
};

module.exports = {
    handleError,
};
