const { kafka } = require("./connect");
const http = require('http');
const emailjs = require("@emailjs/nodejs");
const eventClient = require("../clients/eventClient");
const ticketClient = require("../clients/ticketClient");
const moment = require("moment");

const options = {
    hostname: 'user-service',
    port: '8001',
    // path: '/user/get',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
};

async function startConsumer() {
    const consumer = kafka.consumer({ groupId: 'notification-consumer-group' });
    await consumer.connect();
    consumer.subscribe({ topic: 'ticket-status-event' });

    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const messageValue = JSON.parse(message.value.toString());
            getTicketInformation(messageValue)
                .then(ticketInfo => {
                    console.log(ticketInfo);
                    emailjs.send("service_5bwtfqp", "template_ol6sp26", {
                        event_name: ticketInfo.eventName,
                        city: ticketInfo.location,
                        location: ticketInfo.location,
                        price: ticketInfo.ticketPrice,
                        evt_date: ticketInfo.eventDate,
                        evt_time: ticketInfo.eventTime,
                        name: ticketInfo.userName,
                        purchase_dt: ticketInfo.ticketPurchaseDate,
                    }, {
                        publicKey: 'pqM901cE-thhJ6TSf',
                        privateKey: 'uxBaYpsNbBLzulgi6HN4W'
                    }).then(
                        (response) => {
                          console.log('SUCCESS!', response.status, response.text);
                        },
                        (err) => {
                          console.log('FAILED...', err);
                        },
                    );
                })
                .catch(error => {
                    console.error(error.message);
                });
        },
    });
}

const getTicketInformation = (messageValue) => {
    return new Promise((resolve, reject) => {
        const eventPromise = new Promise((resolve, reject) => {
            eventClient.GetEvent({ id: messageValue?.event_id }, (error, message) => {
                if (error) return reject(error);
                resolve(message);
            });
        });

        const ticketPromise = new Promise((resolve, reject) => {
            ticketClient.GetTicket(
                { ticket_id: messageValue?.ticket_id, user_id: messageValue?.user_id }, 
                (error, message) => {
                    if (error) return reject(error);
                    resolve(message);
                }
            );
        });

        const userPromise = getUserData(messageValue?.user_id);

        Promise.all([eventPromise, ticketPromise, userPromise])
            .then(([eventData, ticketData, userData]) => {
                console.log("ticketData", ticketData);
                const ticketInfo = {
                    userName: userData.name,
                    eventName: eventData.name,
                    eventDescription: eventData.description,
                    location: eventData.location,
                    eventDate: moment(eventData.date, 'X', true).format('L'),
                    eventTime: moment(eventData.date, 'X', true).format('LT'),
                    eventOwner: eventData.user_id,
                    ticketPrice: `$${eventData.price}`,
                    ticketId: ticketData.ticket_id,
                    ticketPurchaseDate: moment(parseInt(ticketData.date_purchased)).format('L'),
                };
                resolve(ticketInfo);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const getUserData = (userId) => {
    return new Promise((resolve, reject) => {
        let data = [];

        const request = http.request({ ...options, path: `/user/get/${userId}` }, (response) => {
            // response.setEncoding('utf8');
            response.on('data', (chunk) => {
                data.push(chunk);
            });

            response.on('end', () => {
                let response = JSON.parse(Buffer.concat(data).toString());
                resolve(response);
            });
        });

        request.on('error', (error) => {
            reject(error);
        });

        request.end();
    });
}

module.exports = { startConsumer };