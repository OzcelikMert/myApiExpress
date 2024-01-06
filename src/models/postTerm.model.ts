import * as mongoose from "mongoose";
import {StatusId} from "../constants/status";
import {PostTypeId} from "../constants/postTypes";
import {PostTermTypeId} from "../constants/postTermTypes";
import userModel from "./user.model";
import languageModel from "./language.model";
import {PostTermContentDocument, PostTermDocument} from "../types/models/postTerm";

const schemaContent = new mongoose.Schema<PostTermContentDocument>(
    {
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        image: {type: String, default: ""},
        title: {type: String, default: ""},
        shortContent: {type: String, default: ""},
        url: {type: String, default: ""}
    },
    {timestamps: true}
).index({langId: 1});

const schema = new mongoose.Schema<PostTermDocument>(
    {
        typeId: {type: Number, required: true, enum: PostTermTypeId},
        postTypeId: {type: Number, required: true, enum: PostTypeId},
        statusId: {type: Number, required: true, enum: StatusId},
        mainId: {type: mongoose.Schema.Types.ObjectId, ref: "postTerms"},
        authorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
        lastAuthorId: {type: mongoose.Schema.Types.ObjectId, ref: userModel, required: true},
        rank: {type: Number, default: 0},
        contents: {type: [schemaContent], default: []},
    },
    {timestamps: true}
).index({typeId: 1, postTypeId: 1, statusId: 1, authorId: 1});

export default mongoose.model<PostTermDocument>("postTerms", schema)