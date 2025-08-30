const mongoose = require("mongoose");

const HomeSectionSchema = new mongoose.Schema(
    {
        type: String, // e.g. 'HeroSlider'
        props: mongoose.Mixed, // any JSON matching the contract above
        order: Number, // display order
        active: Boolean, // on/off toggle
    },
    { timestamps: true }
);
