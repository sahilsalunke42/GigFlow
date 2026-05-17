import { Schema, model, Document } from "mongoose";
import User from "./userModel";
User

enum LeadStatus {
    New = 'new',
    Contacted = 'contacted',
    Qualified = 'qualified',
    Lost = 'lost'
};

enum LeadSource {
    Website = 'website',
    Referral = 'referral',
    Advertisement = 'advertisement',
    Other = 'other'
};

export interface ILead extends Document {
    name: string;
    email: string;
    status: LeadStatus;
    source: LeadSource;
    createdBy: Schema.Types.ObjectId;
};

const LeadSchema = new Schema<ILead>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,   
        enum: LeadStatus,
        default: LeadStatus.New
    },
    source: {   
        type: String,
        enum: LeadSource,
        default: LeadSource.Website
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});


const Lead = model<ILead>('Lead', LeadSchema);

export default Lead;