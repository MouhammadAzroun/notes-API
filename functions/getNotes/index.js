const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    try {
        const result = await db.scan({
            TableName: 'notes-db',
        }).promise();

        const notes = result.Items;

        return sendResponse(200, { success: true, notes });
    } catch (error) {
        console.error('Error retrieving notes from DynamoDB:', error);
        return sendResponse(500, { success: false, error: 'Internal server error.' });
    }
};
