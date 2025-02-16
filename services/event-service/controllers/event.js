const grpc = require("@grpc/grpc-js");
const EVENT = require("../models/event");
const EVENT_IMAGE = require("../models/event-image");
const visitEventProducer = require("../kafka/visit-event-producer");
const upsertDataProducer = require("../kafka/upsert-data-producer");
const moment = require("moment");

async function createEvent(call, callback) {
    const data = call.request;
    const userId = call.metadata.internalRepr.get("x-kong-jwt-claim-user")[0];

    if (!moment(data.date, "X", true).isValid()) {
        let response = {
            msg: "Error occurred during event creation",
            error: "Invalid date format",
        };params
        callback(response, null);
        return;
    }

    event_data = getEventObjectFromPayload(data, userId);
    console.log(event_data, "event obj");

    const result = await EVENT.create(event_data);

    await EVENT_IMAGE.create({
        event_id: result._id,
        images: data.image,
    });

    console.log(result);

    upsertDataProducer.produceMessage("event", JSON.stringify({
        ...data,
        id: result._id,
        user_id: userId,
        created_on: result.createdAt,
        updated_on: result.updatedAt
    }));

    let response = {
        msg: "successfull!",
        id: result._id,
    };

    callback(null, response);
}

async function getEvent(call, callback) {
    const data = call.request;
    const userId = call.metadata.internalRepr.get("x-kong-jwt-claim-user")
        ? call.metadata.internalRepr.get("x-kong-jwt-claim-user")[0]
        : null;

    const result = await EVENT.findById(data.id)
        .then((result) => {
            console.log(result);

            let response = createPayloadFromEventObject(result);

            if (userId) {
                message = {
                    visit_time: Date.now(),
                    user_id: userId,
                };

                visitEventProducer.produceMessage(data.id, JSON.stringify(message));
            }

            callback(null, response);
        })
        .catch((error) => {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "event not found",
            });
        });

    // console.log(result);
}

async function getAllEvents(call, callback) {
    const data = call.request;

    const results = await EVENT.find();

    // console.log(results);
    let response = [];

    for (var result of results) {
        console.log("res", result);
        response.push(createPayloadFromEventObject(result));
    }

    callback(null, { events: response });
}

async function updateEvent(call, callback) {
    const data = call.request;
    const id = data.id;
    const userId = call.metadata.internalRepr.get("x-kong-jwt-claim-user")[0];
    let updatedData = getEventObjectFromPayload(data, userId);
    console.log(updatedData, "event obj");

    for (const [key, value] of Object.entries(updatedData)) {
        if (value == "") {
            delete updatedData[key];
        }
    }

    // if (updatedData.name) {
    //     updatedData.event_name = updatedData.name;
    //     delete updatedData["name"];
    // }

    // delete updatedData.id;

    const result = await EVENT.findOneAndUpdate(
        { _id: id, user_id: userId },
        updatedData,
        { new: true }
    );

    console.log(result.toObject());

    upsertDataProducer.produceMessage("event", JSON.stringify({
        ...data,
        user_id: userId,
        updated_on: result.toObject().updatedAt
    }));

    let response = {
        msg: "successfull!",
    };

    callback(null, response);
}

async function deleteEvent(call, callback) {
    const data = call.request;
    const userId = call.metadata.internalRepr.get("x-kong-jwt-claim-user")[0];

    const result = await EVENT.findOneAndDelete({
        id: data.id,
        user_id: userId,
    });

    console.log(result);

    let response = {
        msg: "successfull!",
    };

    callback(null, response);
}

function getEventObjectFromPayload(data, userId) {
    return {
        event_name: data.name,
        description: data.description,
        date: data.date,
        location: data.location,
        seats: {
            total: data.total,
            booked: 0,
        },
        user_id: userId,
        price: data.price,
    };
}

function createPayloadFromEventObject(data) {
    return {
        id: data._id,
        user_id: data.user_id,
        name: data.event_name,
        description: data.description,
        date: data.date,
        location: data.location,
        total: data.seats.total,
        booked: data.seats.booked,
        price: data.price,
    };
}

module.exports = {
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
};

// TODO: update createEvent
// const data = call.request;

// // console.log(data);
// console.log(data);

// const result = await EVENT.create({
//     event_name: data.name,
//     description: data.description,
//     date: data.date,
//     location: data.location,
//     seats: {
//         total: data.total,
//         booked: 0
//     }
// }).then(async result => {
//     return await EVENT_IMAGE.create({
//         event_id: result._id,
//         images: data.image
//     });
// }).then(async result => {
//     console.log(result);

//     let response = {
//         msg: "successfull!",
//         id: result._id
//     };

//     callback(null, response);
// }).catch(error => {
//     console.error("Error in createEvent:", error);
//     // Handle the error and send an appropriate response to the client
//     let response = {
//         msg: "Error occurred during event creation",
//         error: error.message // or customize the error message as needed
//     };
//     callback(response, null);
// });
