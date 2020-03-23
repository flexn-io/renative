const success = data => ({
    statusCode: 200,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(data),
});

export const handler = (event) => {
    console.log('event', event);
    return success({ ok: true });
};
