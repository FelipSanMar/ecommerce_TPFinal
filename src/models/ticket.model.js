const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
     //   type: mongoose.Schema.Types.ObjectId,
     //   ref: 'user',
     type: String,
     required: true,
     index: true,
     unique: true
    }
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;