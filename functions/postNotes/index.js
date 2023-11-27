const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    const note = JSON.parse(event.body);

    if (!note.title || !note.text) {
        return sendResponse(400, { success: false, error: 'Title and text are required fields.' });
    }

    const noteId = generateUniqueId();

    const now = new Date().toISOString();

    const newNote = {
        id: noteId,
        title: note.title.substring(0, 50), 
        text: note.text.substring(0, 300),   
        createdAt: now,
        modifiedAt: now,
    };

    try {
        await db.put({
            TableName: 'notes-db',
            Item: newNote,
        }).promise();

        return sendResponse(200, { success: true, note: newNote });
    } catch (error) {
        console.error('Error saving note to DynamoDB:', error);
        return sendResponse(500, { success: false, error: 'Internal server error.' });
    }
};

function generateUniqueId() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}
