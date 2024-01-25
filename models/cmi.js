const mongoose = require("mongoose");

const cmiSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        managers: [{
            manager: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        }
        ], users: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        },
        ],
    },
    { timestamps: true }
);

const Company = mongoose.model('Cmi', cmiSchema);


module.exports = Company;
