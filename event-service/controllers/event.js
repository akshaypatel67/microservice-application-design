const EVENT = require("../models/event");
const EVENT_IMAGE = require("../models/event-image");
const producer = require("../kafka/visit-event-producer");

async function createEvent(call, callback) {
    const data = call.request;

    // console.log(data);
    console.log(data);

    const result = await EVENT.create({
        event_name: data.name,
        description: data.description,
        date: data.date,
        location: data.location,
        seats: {
            total: data.total,
            booked: 0
        }
    });

    await EVENT_IMAGE.create({
        event_id: result._id,
        images: data.image
    });

    console.log(result);

    let response = {
        msg: "successfull!",
        id: result._id
    };

    callback(null, response);
}

async function getEvent(call, callback) {
    const data = call.request;
    
    const result = await EVENT.findById(data.id);
    
    console.log(result);

    let response = {
        id: result._id,
        name: result.event_name,
        description: result.description,
        date: result.date,
        location: result.location,
        total: result.seats.total,
        booked: result.seats.booked
    };

    message = {
        visit_time: Date.now()
    };

    producer.produceMessage(data.id, JSON.stringify(message));

    callback(null, response);
}

async function getAllEvents(call, callback) {
    const data = call.request;
    
    const results = await EVENT.find();
    
    // console.log(results);
    let response = [];

    for(var result of results) {
        console.log("res", result);
        response.push({
            id: result._id,
            name: result.event_name,
            description: result.description,
            date: result.date,
            location: result.location,
            total: result.seats.total,
            booked: result.seats.booked
        });
    }

    // let response = {
    //     id: result._id,
    //     name: result.event_name,
    //     description: result.description,
    //     date: result.date,
    //     location: result.location,
    //     total: result.seats.total,
    //     booked: result.seats.booked
    // };

    callback(null, {events: response});
}

async function updateEvent(call, callback) {
    const data = call.request;
    const id = data.id;
    let updatedData = data;

    for (const [key, value] of Object.entries(updatedData)) {
        if(value == '') {
            delete updatedData[key];
        }
    }

    delete updatedData.id;

    const result = await EVENT.findByIdAndUpdate(
        id,
        updatedData
    );

    let response = {
        msg: "successfull!"
    };

    callback(null, response);
}

async function deleteEvent(call, callback) {
    const data = call.request;
    
    const result = await EVENT.findByIdAndDelete(data.id);
    
    console.log(result);

    let response = {
        msg: "successfull!"
    };

    callback(null, response);
}

module.exports = {
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    getAllEvents
}

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