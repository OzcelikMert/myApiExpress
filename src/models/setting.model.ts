import * as mongoose from "mongoose";
import languageModel from "./language.model";
import {
    SettingContactDocument,
    SettingContactFormDocument,
    SettingDocument,
    SettingSeoContentDocument,
    SettingStaticLanguageDocument,
    SettingStaticLanguageContentDocument, SettingSocialMediaDocument, SettingECommerceDocument
} from "../types/models/setting";
import {CurrencyId} from "../constants/currencyTypes";

const schemaStaticLanguageContent = new mongoose.Schema<SettingStaticLanguageContentDocument>(
    {
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        content: {type: String, default: ""}
    },
    {timestamps: true}
).index({langId: 1});

const schemaStaticLanguage = new mongoose.Schema<SettingStaticLanguageDocument>(
    {
        langKey: {type: String, default: "", required: true},
        title: {type: String, default: ""},
        contents: {type: [schemaStaticLanguageContent], default: []}
    },
    {timestamps: true}
);

const schemaContactForm = new mongoose.Schema<SettingContactFormDocument>(
    {
        name: {type: String, default: ""},
        outGoingEmail: {type: String, default: ""},
        email: {type: String, default: ""},
        key: {type: String, default: ""},
        password: {type: String, default: ""},
        inComingServer: {type: String, default: ""},
        outGoingServer: {type: String, default: ""},
        port: {type: Number, default: 465}
    },
    {timestamps: true}
);

const schemaSocialMedia = new mongoose.Schema<SettingSocialMediaDocument>(
    {
        elementId: {type: String},
        title: {type: String},
        url: {type: String},
    }
);

const schemaECommerce = new mongoose.Schema<SettingECommerceDocument>(
    {
        currencyId: {type: Number, enum: CurrencyId, default: CurrencyId.TurkishLira},
    }
);

const schemaContact = new mongoose.Schema<SettingContactDocument>(
    {
        email: {type: String},
        phone: {type: String},
        address: {type: String},
        addressMap: {type: String},
    }
);

const schemaSEOContent = new mongoose.Schema<SettingSeoContentDocument>(
    {
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        title: {type: String, default: ""},
        content: {type: String, default: ""},
        tags: {type: [String], default: []}
    },
    {timestamps: true}
).index({langId: 1});

const schema = new mongoose.Schema<SettingDocument>(
    {
        defaultLangId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        icon: {type: String, default: ""},
        logo: {type: String, default: ""},
        logoTwo: {type: String, default: ""},
        head: {type: String, default: ""},
        script: {type: String, default: ""},
        seoContents: {type: [schemaSEOContent], default: []},
        contact: {type: schemaContact},
        contactForms: {type: [schemaContactForm], default: []},
        staticLanguages: {type: [schemaStaticLanguage], default: []},
        socialMedia: {type: [schemaSocialMedia], default: []},
        eCommerce: {type: schemaECommerce},
    },
    {timestamps: true}
);

export default mongoose.model<SettingDocument>("settings", schema)