const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    const { id } = event.pathParameters;

    if (!id) {
        return sendResponse(400, { success: false, error: 'Note ID is required.' });
    }

    try {
        await db.delete({
            TableName: 'notes-db',
            Key: {
                id,
            },
        }).promise();

        return sendResponse(200, { success: true });
    } catch (error) {
        console.error('Error deleting note from DynamoDB:', error);
        return sendResponse(500, { success: false, error: 'Internal server error.' });
    }
};
